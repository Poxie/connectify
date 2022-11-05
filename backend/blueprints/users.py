import json, os, time
from typing import Union
from flask import Blueprint, request, jsonify
from database import db
from utils.users import get_user_by_id, create_user, get_users_by_username
from utils.posts import create_post, get_user_liked_posts
from utils.auth import token_required, token_optional
from utils.messages import get_unread_message_count

users = Blueprint('users', __name__)

# Get user
@users.get('/users/<int:id>')
@token_optional
def get_user(id: int, token_id: Union[int, None]=None):
    # Getting user
    user = get_user_by_id(id, token_id)
    
    # If user does not exist, throw 404
    if not user:
        return 'User not found', 404

    return jsonify(user)

# Create user
@users.post('/users')
def create_new_user():
    username = request.form.get('username')
    password = request.form.get('password')

    # If missing fields, return bad request
    field_suffix = 'is a required field'
    if not username:
        return 'Username ' + field_suffix, 400
    elif not password:
        return 'Password ' + field_suffix, 400

    # Creating user
    try:
        token = create_user(username, password)
    except ValueError as e:
        return str(e), 409

    return jsonify({ 'token': token })

# Update user
@users.patch('/users/<int:user_id>')
@token_required
def update_user(user_id: int, token_id: int):
    # Making sure user being updated is logged in user
    if token_id != user_id:
        return 'Unauthorized.', 401

    # Checking if banner files are present
    banner = None
    avatar = None
    for key, value in request.files.items():
        app_root = os.path.dirname(os.path.abspath(__file__))
        id = f'{user_id}-{round(time.time())}.png'
        file_name = None

        if key in ['banner']:
            folder = os.path.join(app_root, '../imgs/banner/')
            file_name = os.path.join(folder, id)
            banner = id
            
        if key in ['avatar']:
            folder = os.path.join(app_root, '../imgs/avatar/')
            file_name = os.path.join(folder, id)
            avatar = id

        if file_name:
            value.save(file_name)

    # Creating update query
    query = "UPDATE users SET "
    added_values = []
    variables = ()
    for key, value in request.form.items():
        # Making sure only allowed values are updated
        if key in ['display_name', 'bio']:
            added_values.append(f'{key} = %s')
            variables = variables + (value,)

    # Adding files to query
    if banner:
        added_values.append(f'banner = %s')
        variables += (banner,)
    if avatar:
        added_values.append(f'avatar = %s')
        variables += (avatar,)

    # Combining values and variables
    values = ', '.join(added_values)
    query += values
    query += " WHERE id = %s"
    variables += (user_id,)

    # Executing query
    db.update(query, variables)

    # Fetching new user
    user = get_user_by_id(user_id)

    return jsonify(user)

@users.get('/users/<int:user_id>/likes')
@token_optional
def get_user_likes(user_id: int, token_id: Union[int, None]=None):
    # TODO: check if user exists before fetching posts

    amount = int(request.args.get('amount') or '10');
    start_at = int(request.args.get('start_at') or '0');

    posts = get_user_liked_posts(user_id, token_id, amount=amount, start_at=start_at)
    return jsonify(posts)

# Getting user by search
@users.get('/users/search')
@token_optional
def get_user_by_search(token_id: Union[int, None]=None):
    query = request.args.get('query')
    if not query:
        return 'Query is a required parameter.', 400

    # Getting users by search
    users = get_users_by_username(query, token_id)

    return jsonify(users)

# Getting user urnead messages
@users.get('/users/@me/unread_messages')
@token_required
def get_my_unreads(token_id: int):
    unread_count = get_unread_message_count(token_id)
    return jsonify(unread_count)
import json, os, time
from typing import Union
from flask import Blueprint, request, jsonify
from database import db
from utils.common import get_user_by_id
from utils.posts import get_user_liked_posts
from utils.users import get_users_by_username, create_user, delete_user
from utils.auth import token_required, token_optional
from utils.messages import get_unread_message_count
from cryptography.fernet import Fernet
f = Fernet(os.getenv('CRYPTOGRAPHY_KEY') or '')

users = Blueprint('users', __name__)

@users.get('/users/<int:id>')
@token_optional
def get_user(id: int, token_id: Union[int, None]=None):
    user = get_user_by_id(id, token_id)
    
    # If user does not exist, throw 404
    if not user:
        return 'User not found', 404

    return jsonify(user)


@users.post('/users')
def create_new_user():
    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')

    # If missing fields, return bad request
    field_suffix = 'is a required field.'
    if not username:
        return 'Username ' + field_suffix, 400
    if not password:
        return 'Password ' + field_suffix, 400

    # Creating user
    try:
        token = create_user(username, password, email)
    except ValueError as e:
        return str(e), 409

    return jsonify({ 'token': token })


@users.delete('/users/<int:user_id>')
@token_required
def remove_user(user_id: int, token_id: int):
    if user_id != token_id:
        return 'Unauthorized', 401

    result = delete_user(token_id)

    return jsonify({})


@users.patch('/users/<int:user_id>')
@token_required
def update_user(user_id: int, token_id: int):
    form = request.form.copy()

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

    # Checking if password is updated
    if 'password' in form or 'new_password' in form:
        if 'password' not in form:
            return 'Current password is required when updating password.', 400
        if 'new_password' not in form:
            return 'New password is required when updating password.', 400

        # Fetching user password
        query = "SELECT password FROM users WHERE id = %s"
        values = (token_id,)
        
        result = db.fetch_one(query, values)
        print(result)

        # Comparing password with inputted password
        if result and 'password' in result:
            if f.decrypt(result['password']) != form['password'].encode('utf-8'):
                return 'Password is incorrect.', 401

            # Encrypting password
            form['password'] = f.encrypt(form['new_password'].encode('utf-8'))

        else:
            return 'Unable to procced with the request.', 500

    # Creating update query
    query = "UPDATE users SET "
    added_values = []
    variables = ()
    for key, value in form.items():
        # Making sure only allowed values are updated
        if key in ['display_name', 'bio', 'password']:
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


@users.get('/users/search')
@token_optional
def get_user_by_search(token_id: Union[int, None]=None):
    query = request.args.get('query')
    if not query:
        return 'Query is a required parameter.', 400

    # Getting users by search
    users = get_users_by_username(query, token_id)

    return jsonify(users)


@users.get('/users/@me/unread_messages')
@token_required
def get_my_unreads(token_id: int):
    unread_count = get_unread_message_count(token_id)
    return jsonify(unread_count)
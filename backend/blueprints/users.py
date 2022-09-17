import json
from typing import Union
from flask import Blueprint, request, jsonify
from database import db
from utils.users import get_user_by_id, create_user
from utils.posts import create_post, get_user_liked_posts
from utils.auth import token_required, token_optional

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
        user = create_user(username, password)
    except ValueError as e:
        return str(e), 409

    return jsonify(user)

# Update user
@users.patch('/users/<int:user_id>')
@token_required
def update_user(user_id: int, token_id: int):
    print(request.form)
    
    # Making sure user being updated is logged in user
    if token_id != user_id:
        return 'Unauthorized.', 401

    # Creating update query
    query = "UPDATE users SET "
    added_values = []
    variables = ()
    for key, value in request.form.items():
        # Making sure only allowed values are updated
        if key in ['display_name', 'bio']:
            added_values.append(f'{key} = %s')
            variables = variables + (value,)

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
    posts = get_user_liked_posts(user_id, token_id)
    return jsonify(posts)
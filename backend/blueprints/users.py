import json
from flask import Blueprint, request, jsonify
from database import db
from utils.users import get_user_by_id, create_user
from utils.posts import create_post
from utils.auth import token_required

users = Blueprint('users', __name__)

# Get user
@users.get('/users/<int:id>')
def get_user(id: int):
    cursor = db.cursor()

    # Getting user
    user = get_user_by_id(id)
    
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

# Create user post
@users.post('/users/<int:id>/posts')
@token_required
def create_user_post(id: int):
    title = request.form.get('title')
    content = request.form.get('content')

    # Checking if required fields are missing
    if not title or not content:
        return 'Required fields may not be empty.', 400

    # Checking if user exists
    user = get_user_by_id(id)
    if not user:
        return 'User does not exist.', 404

    # Creating post
    data = {
        'title': title, 
        'content': content,
        'owner_id': id
    }
    post = create_post(data)

    return jsonify(post)
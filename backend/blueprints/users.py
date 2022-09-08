import json
from flask import Blueprint, request, jsonify
from database import db
from utils.users import get_user_by_id, create_user

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

    # If username is not present, return bad request
    if not username:
        return 'Username is a required field.', 400

    # Creating user
    user = None
    try:
        user = create_user(username)
    except ValueError as e:
        return str(e), 409

    return jsonify(user)
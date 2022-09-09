import os
import jwt
from flask import Blueprint, request, jsonify
from utils.users import get_user_by_username
from cryptography.fernet import Fernet
f = Fernet(os.getenv('CRYPTOGRAPHY_KEY') or '')

login = Blueprint('login', __name__)

@login.post('/login')
def user_login():
    username = request.form.get('username')
    password = request.form.get('password')

    # If fields are empty, return bad request
    if not username or not password:
        return 'Required fields may not be empty.', 400

    # Getting user by username
    user = get_user_by_username(username, True)

    # If user does not exist
    if not user:
        return 'Login details are incorrect.', 409
    
    # Comparing hashed password with user inputted password
    if f.decrypt(user['password']) != password.encode('utf-8'):
        return 'Login details are incorrect.', 409
    
    # Creating user access token
    token = jwt.encode({ 'id': user['id'] }, os.getenv('JWT_SECRET_JEY') or '')

    return jsonify({ 'token': token })
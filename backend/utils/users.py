import jwt, os
from database import db
from random import randrange
from typing import Union
from utils.constants import DEFAULT_AVATAR_COUNT
from utils.common import get_user_by_id, create_id
from cryptography.fernet import Fernet
f = Fernet(os.getenv('CRYPTOGRAPHY_KEY') or '')

"""
Function to fetch multiple users based on username search.
Username must not exactly match to appear, this function checks
for usernames similar to the username query.
"""
def get_users_by_username(username: str, token_id: Union[int, None]=None):
    query = "SELECT * FROM users WHERE username LIKE CONCAT('%', %s, '%') OR display_name LIKE CONCAT('%', %s, '%')"
    values = (username, username)

    users = db.fetch_all(query, values)

    # Upgrading users with properties
    users = [get_user_by_id(user['id']) for user in users]
    users.sort(key=lambda x: x['follower_count'] if x else -1, reverse=True)

    return users

"""
Simple function to fetch basic data based on email match.
"""
def get_user_by_email(email: str):
    query = "SELECT * FROM users WHERE email = %s"
    values = (email,)

    user = db.fetch_one(query, values)

    return user

"""
Simple function to fetch basic data based on username match.
"""
def get_user_by_username(username: str, with_password=False):
    query = "SELECT * FROM users WHERE username = %s"
    values = (username,)

    user = db.fetch_one(query, values)

    if user and not with_password:
        del user['password']

    return user

"""
Creates a new user. When creating an account, only username and
password are required. Function will return a token, which can be
used to authenticate for future http requests.
"""
def create_user(username: str, password: str, email: Union[str, None]=None):
    # Checking if username is available
    username_unavailable = get_user_by_username(username)
    if username_unavailable:
        raise ValueError('Username is unavailable.')
    
    # Encrypting password
    encoded_password = password.encode('utf-8')
    hashed_password = f.encrypt(encoded_password)

    # Creating unique id
    id = create_id('users')

    # Getting random avatar
    avatar = f'default{randrange(0, DEFAULT_AVATAR_COUNT)}.png'

    # Creating insert query
    query = "INSERT INTO users (id, username, password, email, avatar) VALUES (%s, %s, %s, %s, %s)"
    values = (id, username, hashed_password, email, avatar)

    # Creating user
    db.insert(query, values)

    # Creating token for user
    token = jwt.encode({ 'id': id }, os.getenv('JWT_SECRET_KEY') or '')

    return token

"""
Function to delete a user.
"""
def delete_user(user_id: int):
    query = "UPDATE users SET password = '', username = 'deleted-user', email = '', display_name = 'Deleted User', bio='' WHERE id = %s"
    result = db.update(query, (user_id,))
    
    return result
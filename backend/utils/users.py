import os
from random import randrange
from typing import Union
from database import db
from utils.followers import get_user_follower_count, get_follower
from cryptography.fernet import Fernet
f = Fernet(os.getenv('CRYPTOGRAPHY_KEY') or '')

DEFAULT_AVATAR_COUNT = 4

# Hydrating user
def hydrate_user(user, token_id):
    # Fetching user follower count
    follower_count = get_user_follower_count(user['id'])
    user['follower_count'] = follower_count

    # 

    # Checking if user is self
    user['is_self'] = False
    if token_id == user['id']:
        user['is_self'] = True
    else:
        # Checking if current user is following fetched user
        user['is_following'] = False
        if token_id:
            follow = get_follower(token_id, user['id'])
            if follow:
                user['is_following'] = True

    return user

# Function to fetch 
def get_user_by_username(username: str, with_password=False):
    # Creating select query
    query = "SELECT * FROM users WHERE username = %s"
    values = (username,)

    # Fetching user
    user = db.fetch_one(query, values)

    # Deleting unwanted user information
    if user and not with_password:
        del user['password']

    return user

# Function to fetch user by id
def get_user_by_id(id: int, token_id: Union[int, None]=None):
    # Creating select query
    query = "SELECT * FROM users WHERE id = %s"
    values = (id,)

    # Fetching user
    user = db.fetch_one(query, values)

    # Adding extra attribues
    if user:
        user = hydrate_user(user, token_id)

    # Deleting unwanted user information
    if user:
        del user['password']

    return user

# Creating new user id
USER_ID_LENGTH = 10
def create_user_id() -> int:
    opts = '0123456789'
    
    # Creating random id
    id = ''
    for i in range(USER_ID_LENGTH):
        id += opts[randrange(len(opts))]
    id = int(id)

    # Checking if id already exists
    user = get_user_by_id(id)
    if user:
        return create_user_id()

    # Else return created id
    return id

# Function to create new user
def create_user(username: str, password: str):
    # Checking if username is available
    username_unavailable = get_user_by_username(username)
    if username_unavailable:
        raise ValueError('Username is unavailable.')
    
    # Encrypting password
    encoded_password = password.encode('utf-8')
    hashed_password = f.encrypt(encoded_password)

    # Creating unique id
    id = create_user_id()

    # Getting random avatar
    avatar = f'default{randrange(0, DEFAULT_AVATAR_COUNT)}.png'

    # Creating insert query
    query = "INSERT INTO users (id, username, password, avatar) VALUES (%s, %s, %s, %s)"
    values = (id, username, hashed_password, avatar)

    # Creating user
    db.insert(query, values)

    # Fetching created user
    user = get_user_by_id(id)

    return user

# Function to bulk get users by username
def get_users_by_username(username: str):
    # Creating query
    query = "SELECT * FROM users WHERE username LIKE CONCAT('%', %s, '%') OR display_name LIKE CONCAT('%', %s, '%')"
    values = (username,username)

    # Fetching users
    users = db.fetch_all(query, values)

    return users
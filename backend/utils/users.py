import os, jwt, time
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

    # Creating token for user
    token = jwt.encode({ 'id': id }, os.getenv('JWT_SECRET_KEY') or '')

    return token

# Function to bulk get users by username
def get_users_by_username(username: str, token_id: Union[int, None]=None):
    # Creating query
    query = "SELECT * FROM users WHERE username LIKE CONCAT('%', %s, '%') OR display_name LIKE CONCAT('%', %s, '%')"
    values = (username,username)

    # Fetching users
    users = db.fetch_all(query, values)

    # Hydarting users
    for user in users:
        user = hydrate_user(user, token_id)

    return users

# Creating notification id
NOTIFICATION_ID_LENGTH = 10
def create_notification_id() -> int:
    opts = '0123456789'
    
    # Creating random id
    id = ''
    for i in range(NOTIFICATION_ID_LENGTH):
        id += opts[randrange(len(opts))]
    id = int(id)

    # Checking if id already exists
    notification = get_notification_by_id(id)
    if notification:
        return create_notification_id()

    # Else return created id
    return id

# Getting notification by id
def get_notification_by_id(id: int):
    query = "SELECT * FROM notifications WHERE id = %s"
    values = (id,)
    
    notification = db.fetch_one(query, values)
    return notification

# Function to add user notification
def add_user_notification(reference_id: int, user_reference_id: int, type: int, created_at: Union[float, None]=None):
    if not created_at:
        created_at = time.time()

    # Users to notifiy
    user_ids = []

    # If notification type is post
    if type == 0:
        # Checking what users should be notified
        query = """
        SELECT users.id FROM followers
        INNER JOIN users ON followers.follower_id = users.id
        WHERE followers.followee_id = %s
        """
        values = (user_reference_id,)

        # Getting ids
        data = db.fetch_all(query, values)
        if not data:
            return

        user_ids = [dict['id'] for dict in data]

    # If notification type is message
    elif type == 2:
        query = """
        SELECT recipients.id FROM messages
        INNER JOIN recipients ON messages.channel_id = recipients.channel_id
        WHERE messages.id = %s
        """
        values = (reference_id,)

        data = db.fetch_all(query, values)
        user_ids = [dict['id'] for dict in data if dict['id'] != user_reference_id]

    # Inserting notification for users
    for user_id in user_ids:
        id = create_notification_id()
        query = "INSERT INTO notifications (id, user_id, type, reference_id, user_reference_id, created_at) VALUES (%s, %s, %s, %s, %s, %s)"
        values = (
            id,
            user_id,
            type,
            reference_id,
            user_reference_id,
            created_at
        )

        # Inserting notification
        db.insert(query, values)
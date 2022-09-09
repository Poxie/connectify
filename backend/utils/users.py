import os
from random import randrange
from tkinter.messagebox import RETRY
from database import db
from mysql.connector.cursor import MySQLCursorDict
from cryptography.fernet import Fernet
f = Fernet(os.getenv('CRYPTOGRAPHY_KEY') or '')

# Function to fetch 
def get_user_by_username(username: str):
    cursor = MySQLCursorDict(db)

    # Creating select query
    query = "SELECT * FROM users WHERE username = %s"
    values = (username,)

    # Fetching user
    cursor.execute(query, values)
    user = cursor.fetchone()

    # Deleting unwanted user information
    if user:
        del user['password']

    return user

# Function to fetch user by id
def get_user_by_id(id: int):
    cursor = MySQLCursorDict(db)

    # Creating select query
    query = "SELECT * FROM users WHERE id = %s"
    values = (id,)

    # Fetching user
    cursor.execute(query, values)
    user = cursor.fetchone()

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
    cursor = MySQLCursorDict(db)

    # Checking if username is available
    username_unavailable = get_user_by_username(username)
    if username_unavailable:
        raise ValueError('Username is unavailable.')
    
    # Encrypting password
    encoded_password = password.encode('utf-8')
    hashed_password = f.encrypt(encoded_password)

    # Creating unique id
    id = create_user_id()

    # Creating insert query
    query = "INSERT INTO users (id, username, password) VALUES (%s, %s, %s)"
    values = (id, username, hashed_password)

    # Creating user
    cursor.execute(query, values)
    db.commit()

    # Fetching created user
    user = get_user_by_id(id)

    return user
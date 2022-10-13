import re
from utils.users import get_user_by_id
from database import db
from random import randrange
import time

# Creating message id
MESSAGE_ID_LENGTH = 10
def create_message_id() -> int:
    opts = '0123456789'
    
    # Creating random id
    id = ''
    for i in range(MESSAGE_ID_LENGTH):
        id += opts[randrange(len(opts))]
    id = int(id)

    # Checking if id already exists
    message = get_message_by_id(id)
    if message:
        return create_message_id()

    # Else return created id
    return id

# Hydrating messages
def hydrate_message(message):
    if not message:
        return message

    # Adding author to message
    author = get_user_by_id(message['author_id'])
    message['author'] = author

    return message

# Getting messages
def get_channel_messages(channel_id: int, amount: int=50, start_at: int=0):
    # Creating select query
    query = "SELECT * FROM messages WHERE channel_id = %s ORDER BY timestamp DESC LIMIT %s, %s"
    values = (channel_id, start_at, amount)

    # Executing query
    messages = db.fetch_all(query, values)
    if messages:
        messages = messages[::-1]

    # Hydrating messages
    for message in messages:
        message = hydrate_message(message)

    return messages

# Getting specific message
def get_message_by_id(id: int):
    # Creating select query
    query = "SELECT * FROM messages WHERE id = %s"
    values = (id,)

    # Executing query
    message = db.fetch_one(query, values)

    # Hydrating message
    message = hydrate_message(message)

    return message

# Creating message
def create_channel_message(message):
    # Creating id
    id = create_message_id()

    # Creating insert query
    query = "INSERT INTO messages (id, channel_id, author_id, content, timestamp) VALUES (%s, %s, %s, %s, %s)"
    values = (
        id,
        message['channel_id'],
        message['author_id'],
        message['content'],
        time.time()
    )

    # Executing insert query
    db.insert(query, values)

    # Updating last message timestamp
    update_query = "UPDATE channels SET last_message_timestamp = %s WHERE id = %s"
    update_values = (time.time(), message['channel_id'])
    db.update(update_query, update_values)

    # Fetching created message
    message = get_message_by_id(id)
    
    return message

# Getting unread message count
def get_unread_message_count(user_id: int):
    # Creating query
    query = "SELECT SUM(unread_count) AS count FROM recipients WHERE id = %s"
    values = (user_id,)

    # Fetching count
    count = db.fetch_one(query, values)

    return count
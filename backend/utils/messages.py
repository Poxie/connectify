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

# Getting messages
def get_channel_messages(channel_id: int):
    # Creating select query
    query = "SELECT * FROM messages WHERE channel_id = %s"
    values = (channel_id,)

    # Executing query
    messages = db.fetch_all(query, values)

    return messages

# Getting specific message
def get_message_by_id(id: int):
    # Creating select query
    query = "SELECT * FROM messages WHERE id = %s"
    values = (id,)

    # Executing query
    message = db.fetch_one(query, values)

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

    # Fetching created message
    message = get_message_by_id(id)
    
    return message
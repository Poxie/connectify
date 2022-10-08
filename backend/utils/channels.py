from typing import List
from random import randrange
from database import db

# Creating channel id
CHANNEL_ID_LENGTH = 10
def create_channel_id() -> int:
    opts = '0123456789'
    
    # Creating random id
    id = ''
    for i in range(CHANNEL_ID_LENGTH):
        id += opts[randrange(len(opts))]
    id = int(id)

    # Checking if id already exists
    channel = get_channel_by_id(id)
    if channel:
        return create_channel_id()

    # Else return created id
    return id

# Getting channel by id
def get_channel_by_id(id):
    query = "SELECT * FROM channels WHERE id = %s"
    values = (id,)

    # Executing query
    channel = db.fetch_one(id, values)
    
    return channel

# Getting channel by recipient ids
def get_channel_by_recipients(token_id: int, recipient_id: int):
    query = """
    SELECT channels.* FROM recipients
        INNER JOIN channels ON recipients.channel_id = channels.id
    WHERE recipients.id = %s OR recipients.id = %s
    """
    values = (token_id, recipient_id)

    # Getting both recipient channels
    recipient_channels = db.fetch_all(query, values)

    # Comparing channels
    if recipient_channels:
        print(recipient_channels)

    # return result

# Getting my channels
def get_my_channels(token_id: int):
    # Creating fetch user channels query
    query = """
    SELECT channels.* FROM recipients
        INNER JOIN channels ON recipients.channel_id = channels.id
    WHERE recipients.id = %s
    """
    values = (token_id,)

    # Fetching channels
    channels = db.fetch_all(query, values)
    
    # Returning if channels is None
    if not channels:
        return channels
    
    # Fetching channel recipients
    for channel in channels:
        recipients_query = """
        SELECT users.* FROM recipients
            INNER JOIN users ON recipients.id = users.id
        WHERE recipients.channel_id = %s
        AND recipients.id != %s
        """
        values = (channel['id'], token_id)

        recipients = db.fetch_all(recipients_query, values)

        # Sanitizing recipients
        for recipient in recipients:
            del recipient['password']
        
        channel['recipients'] = recipients

    return channels

def create_channel(type: int, token_id: int, recipient_id: int):
    # Checking if channel is already present
    get_channel_by_recipients(token_id, recipient_id)
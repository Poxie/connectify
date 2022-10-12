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
    # Getting channel
    channel_query = "SELECT * FROM channels WHERE id = %s"
    channel_values = (id,)

    # Fetching channel
    channel = db.fetch_one(channel_query, channel_values)

    # Getting channel recipients
    recipient_query = """
    SELECT users.* FROM recipients
        INNER JOIN users ON recipients.id = users.id
    WHERE recipients.channel_id = %s
    """
    recipient_values = (id,)

    # Executing query
    recipients = db.fetch_all(recipient_query, recipient_values)
    if recipients:
        for recipient in recipients:
            del recipient['password']
    
    # Adding recipients to channel
    if channel:
        channel['recipients'] = recipients
    
    return channel

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
    print('hey')
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
    # Fetching involved parties' channels
    my_channels = get_my_channels(token_id)
    recipient_channels = get_my_channels(recipient_id)

    # Transforming channels to ids
    my_channel_ids = [channel['id'] for channel in my_channels]
    recipient_channel_ids = [channel['id'] for channel in recipient_channels]

    # Finding mutal channel
    mutual_channel_ids = set(my_channel_ids).intersection(recipient_channel_ids)
    channel_id = None
    if len(mutual_channel_ids) > 0:
        channel_id = mutual_channel_ids.pop()

    # If mutual channel does not exist, create channel
    if not channel_id:
        # Creating channel id
        id = create_channel_id()
        channel_id = id
        
        # Inserting channel
        channel_insert_query = "INSERT INTO channels (id, type, name, icon) VALUES (%s, %s, %s, %s)"
        channel_insert_values = (
            id,
            type,
            None,
            None
        )
        db.insert(channel_insert_query, channel_insert_values)

        # Inserting recipients
        recipient_insert_query = "INSERT INTO recipients (id, channel_id) VALUES (%s,%s), (%s,%s)"
        recipient_insert_values = (
            token_id,
            id,
            recipient_id,
            id
        )
        db.insert(recipient_insert_query, recipient_insert_values)

    # Fetching channel channel
    channel = get_channel_by_id(channel_id)

    # Removing self from recipients
    if channel and 'recipients' in channel:
        new_recipients = [recipient for recipient in channel['recipients'] if recipient['id'] != token_id]
        channel['recipients'] = new_recipients

    return channel
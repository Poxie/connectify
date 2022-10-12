from typing import List, Union
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

# Hydarating channel
def hydrate_channel(channel, token_id):
    # Getting channel recipients
    recipient_query = """
    SELECT * FROM recipients
    JOIN users
    ON recipients.id = users.id
    WHERE recipients.channel_id = %s
    """
    recipient_values = (channel['id'],)

    # Fetching recipients
    recipients = db.fetch_all(recipient_query, recipient_values)

    # Removing unwanted properties
    if recipients:
        for recipient in recipients:
            del recipient['password']

    # Adding channel properties
    if channel and recipients:
        new_recipients = []
        unread_count = 0

        for recipient in recipients:
            # Adding unread_count if recipient is fetching user
            if recipient['id'] == token_id:
                unread_count = recipient['unread_count']

            # Else adding recipient to recipient list
            else:
                new_recipients.append(recipient)

        # Updating channel properties
        channel['recipients'] = new_recipients
        channel['unread_count'] = unread_count

    # Returning channel
    return channel

# Getting channel by id
def get_channel_by_id(id: int, token_id: Union[int, None]=None):
    # Getting channel
    channel_query = "SELECT * FROM channels WHERE id = %s"
    channel_values = (id,)

    # Fetching channel
    channel = db.fetch_one(channel_query, channel_values)

    # Hydrating channel
    channel = hydrate_channel(channel, token_id)
    
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
    channels = db.fetch_all(query, values)
    
    # Returning if channels is None
    if not channels:
        return channels
    
    # Fetching channel recipients
    for channel in channels:
        channel = hydrate_channel(channel, token_id)

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
    channel = get_channel_by_id(channel_id, token_id)

    return channel

# Updating recipient unread
def update_unread_count(channel_id: int, recipient_id: int, count: int):
    # Creating update query
    query = "UPDATE recipients SET unread_count = %s WHERE channel_id = %s AND id = %s"
    values = (count, channel_id, recipient_id)

    # Exeucting update query
    db.update(query, values)

    return {}

# Increasing recipient unread
def increase_unread_count(channel_id: int, recipient_id: int, amount: int=1):
    # Creating recipient query
    recipient_query = "SELECT * FROM recipients WHERE channel_id = %s AND id = %s"
    recipient_values = (channel_id, recipient_id)

    # Fetching recipient
    recipient = db.fetch_one(recipient_query, recipient_values)
    if not recipient:
        return

    # Finding new coutn
    prev_count = recipient['unread_count']
    new_count = prev_count + amount

    # Updating count
    update_query = "UPDATE recipients SET unread_count = %s WHERE channel_id = %s AND id = %s"
    update_values = (new_count, channel_id, recipient_id)

    # Executing update
    db.update(update_query, update_values)

    return {}
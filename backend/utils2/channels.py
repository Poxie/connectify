from flask import abort
from typing import Union
from database import db
from utils2.common import get_user_by_id, get_message_by_id, create_id

"""
Function to fetch a recipient. The function hydrates the user with user
properties and personalize these properties using the optional token_id,
for instnace is_following.
"""
def get_recipient_by_id(user_id: int, token_id: Union[int, None]=None):
    query = """
    SELECT 
        u.*, 
        COUNT(DISTINCT p.id) AS post_count,
        COUNT(DISTINCT l.parent_id) AS like_count,
        COUNT(DISTINCT f.follower_id) AS follower_count,
        IF(f2.follower_id IS NULL, FALSE, TRUE) as is_following,
        r.*
    FROM users u
        LEFT JOIN posts p ON p.author_id = u.id
        LEFT JOIN likes l ON p.id = l.parent_id
        LEFT JOIN followers f ON f.followee_id = u.id
        LEFT JOIN followers f2 ON (f2.followee_id = u.id AND f2.follower_id = %s)
        LEFT JOIN recipients r ON r.id = u.id
    WHERE 
        u.id = %s
    """
    values = (token_id, user_id)

    recipient = db.fetch_one(query, values)

    return recipient

"""
Function to fetch a channel by id. Initially fetches channel data and
recipient ids from the database. Then it fetches each recipient of the
channel and adds the unread_count relative to the fetching user.
"""
def get_channel_by_id(channel_id: int, token_id: Union[int, None]=None):
    query = """
    SELECT 
        channels.*,
        GROUP_CONCAT(DISTINCT u.id) AS recipient_ids
    FROM channels
        JOIN recipients r ON r.channel_id = channels.id
        JOIN users u on u.id = r.id
    WHERE 
        channels.id = %s
    """
    values = (channel_id,)

    channel = db.fetch_one(query, values)

    if channel:
        # Converting mysql string list to python list
        channel['recipient_ids'] = [int(id) for id in channel['recipient_ids'].split(',')]
        
        # Checking if user has access to channel
        if token_id not in channel['recipient_ids']:
            abort(401)

        # Adding recipients to chennel
        recipients = []
        unread_count = 0
        for recipient_id in channel['recipient_ids']:
            recipient = get_recipient_by_id(recipient_id, token_id)
            if recipient and recipient['id'] == token_id:
                unread_count = recipient['unread_count']
                continue

            recipients.append(recipient)
        
        channel['recipients'] = recipients
        channel['unread_count'] = unread_count

        # Fetching last message
        channel['last_message'] = get_message_by_id(channel['last_message_id'])

    return channel

"""
Function to bulk get channels a user is part of. It simply gets the channel ids
the user is part of and hydrates those with the information related to the ids.
"""
def get_user_channels(user_id: int):
    query = """
    SELECT 
        c.id,
        c.last_message_timestamp
    FROM channels c
        JOIN recipients r ON r.channel_id = c.id
    WHERE 
        r.id = %s
    """
    values = (user_id,)

    data = db.fetch_all(query, values)

    channels = []
    if data:
        data.sort(key=lambda x: x['last_message_timestamp'] or 0, reverse=True)
        for item in data:
            channel = get_channel_by_id(item['id'], user_id)
            channels.append(channel)

    return channels

"""
Function to create a user channel. Three arguments are required: type, token_id,
and recipient_id. Argument type defines what type of channel to create, token_id is
the id of the user creating the channel, and recipient_id is the id of the recipient.
First mutual channels are checked, if users have a channel in common, return that channel.
Otherwise a new channel will be created and returned.
"""
def create_channel(type: int, token_id: int, recipient_id: int):
    # Query to fetch channel ids belonging to a user
    channel_query = """
    SELECT 
        c.id 
    FROM channels c
        JOIN recipients r ON r.channel_id = c.id
    WHERE r.id = %s
    """

    my_values = (token_id,)
    recipient_values = (recipient_id,)

    # Fetching both users' channel ids
    my_channel_data = db.fetch_all(channel_query, my_values)
    recipient_channel_data = db.fetch_all(channel_query, recipient_values)

    my_channel_ids = [item['id'] for item in my_channel_data or []]
    recipient_channel_ids = [item['id'] for item in recipient_channel_data or []]

    # Finding mutal channel
    mutual_channel_ids = set(my_channel_ids).intersection(recipient_channel_ids)
    channel_id = None
    if len(mutual_channel_ids) > 0:
        channel_id = mutual_channel_ids.pop()

    # If mutual channel does not exist, create channel
    if not channel_id:
        id = create_id('channels')
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

"""
Function to increase recipient unread messages count.
"""
def increase_unread_count(channel_id: int, recipient_id: int, amount: int=1):
    # Fetching recipient
    recipient_query = "SELECT * FROM recipients WHERE channel_id = %s AND id = %s"
    recipient_values = (channel_id, recipient_id)

    recipient = db.fetch_one(recipient_query, recipient_values)
    if not recipient:
        return

    # Finding new count
    prev_count = recipient['unread_count']
    new_count = prev_count + amount

    # Updating count
    update_query = "UPDATE recipients SET unread_count = %s WHERE channel_id = %s AND id = %s"
    update_values = (new_count, channel_id, recipient_id)

    # Executing update
    db.update(update_query, update_values)

    return {}

"""
Function to update unread_count. If user reads messages, we update the
unread count of the specific notifications for the messages.
"""
def update_unread_count(channel_id: int, recipient_id: int, count: int):
    # Updating notifications for channel
    if count == 0:
        notif_query = """
        SELECT 
            n.id 
        FROM messages m
            INNER JOIN notifications n ON m.id = n.reference_id
            INNER JOIN channels c ON c.id = m.channel_id
        WHERE 
            c.id = %s AND n.unread = 1
        """
        notif_values = (channel_id,)

        notifs = db.fetch_all(notif_query, notif_values)
        
        notif_ids = [notif['id'] for notif in notifs]
        where_values = [f'id = {id}' for id in notif_ids]
        where_query = ' or '.join(where_values)

        if where_query:
            update_query = "UPDATE notifications SET unread = 0 WHERE " + where_query
            print(update_query)
            db.update(update_query)

    # Creating update query
    query = "UPDATE recipients SET unread_count = %s WHERE channel_id = %s AND id = %s"
    values = (count, channel_id, recipient_id)

    # Exeucting update query
    db.update(query, values)

    return {}
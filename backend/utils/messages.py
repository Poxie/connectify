import time
from database import db
from random import randrange
from utils.common import get_message_by_id, add_user_notification, create_id

"""
Function to fetch channel messages. Amount (amount) and pivot start index (start_at)
can be used for pagination. Desired message ids are fetched, then looped through
to hydrate message information related to selected id.
"""
def get_channel_messages(channel_id: int, amount: int=50, start_at: int=0):
    query = "SELECT id FROM messages WHERE channel_id = %s ORDER BY timestamp DESC LIMIT %s, %s"
    values = (channel_id, start_at, amount)

    data = db.fetch_all(query, values)

    message_ids = [item['id'] for item in data or []]

    messages = []
    for message_id in message_ids:
        message = get_message_by_id(message_id)
        messages.append(message)

    return messages[::-1]

"""
Gets the total count of unread messages of a user.
"""
def get_unread_message_count(user_id: int):
    query = "SELECT SUM(unread_count) AS count FROM recipients WHERE id = %s"
    values = (user_id,)

    data = db.fetch_one(query, values)

    # If not count, set count as 0
    if data and 'count' in data and not data['count']:
        data = {'count': 0}

    return data

"""
Creates a new channel message.
"""
def create_channel_message(message):
    id = create_id('messages')

    # Creating message
    created_at = time.time()
    query = "INSERT INTO messages (id, channel_id, author_id, content, timestamp) VALUES (%s, %s, %s, %s, %s)"
    values = (
        id,
        message['channel_id'],
        message['author_id'],
        message['content'],
        created_at
    )

    db.insert(query, values)

    # Updating last message timestamp
    update_query = "UPDATE channels SET last_message_timestamp = %s, last_message_id = %s WHERE id = %s"
    update_values = (created_at, id, message['channel_id'])
    db.update(update_query, update_values)

    # Fetching created message
    message = get_message_by_id(id)

    # Creating notification for recipient
    if message:
        add_user_notification(
            reference_id=id,
            user_reference_id=message['author_id'],
            created_at=created_at,
            type=2
        )
    
    return message
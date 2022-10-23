import time
from random import randrange
from database import db
from typing import Union
from utils.posts import get_post_by_id
from utils.users import get_user_by_id
from utils.messages import get_message_by_id

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

# Function to get user notifications
def get_user_notifications(user_id: int):
    # Creating query
    query = "SELECT * FROM notifications WHERE user_id = %s"
    values = (user_id,)

    # Fetching notifications
    notifs = db.fetch_all(query, values)

    # Creating new notification objects
    notifications = []
    for notif in notifs:
        type = notif['type']
        reference_id = notif['reference_id']
        user_reference_id = notif['user_reference_id']
        created_at = notif['created_at']
        unread = notif['unread']

        # Fetching reference and user
        reference = None
        user_reference = None

        # If notification type is post
        if type == 0:
            reference = get_post_by_id(reference_id)
            user_reference = get_user_by_id(user_reference_id)
        
        # If notification type is message
        elif type == 2:
            refernece = get_message_by_id(reference_id)
            user_reference = get_user_by_id(user_reference_id)

        # Appending notification
        if reference and user_reference:
            notifications.append({
                'reference': reference,
                'user_reference': user_reference,
                'type': type,
                'created_at': created_at,
                'unread': unread == 1
            })

    # Returning notifications
    return notifications

# Getting user notification count
def get_user_notification_count(user_id: int):
    query = "SELECT COUNT(*) AS count FROM notifications WHERE user_id = %s"
    values = (user_id,)

    data = db.fetch_one(query, values)
    if not data or not data['count']:
        data = {'count': 0}

    return data
import time
from random import randrange
from database import db
from typing import Union
from utils.posts import get_post_by_id
from utils.users import get_user_by_id
from utils.messages import get_message_by_id

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
            reference = get_message_by_id(reference_id)
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
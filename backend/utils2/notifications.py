from database import db
from utils2.common import get_message_by_id, get_post_by_id, get_user_by_id

"""
Function to fetch user notifications. It returns any notification,
read or unread. A notification dict is created, which has some
generic properties, most important: reference and user_reference.
Those are determined based on the notification type.
"""
def get_user_notifications(user_id: int, amount: int, start_at: int):
    # Fetching notifications
    query = "SELECT * FROM notifications WHERE user_id = %s ORDER BY created_at DESC LIMIT %s, %s"
    values = (user_id, start_at, amount)

    notifs = db.fetch_all(query, values)

    # Creating new notification dicts
    notifications = []
    for notif in notifs:
        id = notif['id']
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
                'id': id,
                'reference': reference,
                'user_reference': user_reference,
                'type': type,
                'created_at': created_at,
                'unread': unread == 1
            })

    return notifications

"""
Function to get a user's total notification count.
"""
def get_user_notification_count(user_id: int):
    query = "SELECT COUNT(*) AS count FROM notifications WHERE user_id = %s AND unread = 1"
    values = (user_id,)

    data = db.fetch_one(query, values)

    data = data if data else {'count': 0}

    return data

"""
Function to reset a user's notification count.
"""
def reset_user_notification_count(user_id: int):
    query = "UPDATE notifications SET unread = 0 WHERE user_id = %s AND unread = 1"
    values = (user_id,)

    db.update(query, values)
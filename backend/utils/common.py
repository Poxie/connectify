import time, os
from database import db
from random import randrange
from database import db
from typing import Union
from utils.constants import ID_LENGTH

def create_id(table: str):
    opts = '1234567890'

    # Creating random id
    id = ''
    for i in range(ID_LENGTH):
        id += opts[randrange(len(opts))]
    id = int(id)

    # Checking if id exists
    query = f"SELECT * FROM `{table}` WHERE id = %s"
    values = (id,)

    data = db.fetch_one(query, values)
    if data:
        return create_id(table)

    return id

def get_user_by_id(id: int, token_id: Union[int, None]=None):
    query = """
    SELECT 
        users.*, 
        COUNT(DISTINCT p.id) AS post_count,
        COUNT(DISTINCT l.timestamp) AS like_count,
        COUNT(DISTINCT f.follower_id) AS follower_count,
        IF(f2.follower_id IS NULL, FALSE, TRUE) as is_following
    FROM users
        LEFT JOIN posts p ON p.author_id = users.id
        LEFT JOIN likes l ON p.id = l.parent_id
        LEFT JOIN followers f ON f.followee_id = users.id
        LEFT JOIN followers f2 ON (f2.followee_id = users.id AND f2.follower_id = %s)
    WHERE 
        users.id = %s
    """
    values = (token_id, id)

    user = db.fetch_one(query, values)
    if user and 'id' in user and user['id'] is None:
        user = None

    if user:
        # Deleting unwanted properties
        del user['password']

        # Checking if user is self
        user['is_self'] = False
        if id == token_id:
            user['is_self'] = True
        
        # Checking if self is following
        user['is_following'] = bool(user['is_following'])

    return user

def get_post_by_id(id: int, token_id: Union[int, None]=None):
    query = """
    SELECT
        posts.*,
        GROUP_CONCAT(a.id) AS attachment_ids,
        COUNT(DISTINCT l.user_id) AS like_count,
        COUNT(DISTINCT c.id) AS comment_count,
        IF(l2.user_id IS NULL, FALSE, TRUE) AS has_liked 
    FROM posts
        LEFT JOIN attachments a ON a.parent_id = posts.id
        LEFT JOIN likes l ON l.parent_id = posts.id
        LEFT JOIN comments c ON c.post_id = posts.id
        LEFT JOIN likes l2 ON l.user_id = %s
    WHERE
        posts.id = %s
    """
    values = (token_id, id)

    post = db.fetch_one(query, values)
    if post and 'id' in post and post['id'] is None:
        post = None

    if post:
        # Checking if self has liked
        post['has_liked'] = bool(post['has_liked'])

        # Adding author to post
        post['author'] = get_user_by_id(post['author_id'])

        # Adding attachments to post
        post['attachments'] = []
        if post['attachment_ids']:
            for id in post['attachment_ids'].split(','):
                attachment = get_attachment_by_id(int(id))
                post['attachments'].append(attachment)

    return post

def get_message_by_id(message_id: int):
    query = """
    SELECT * FROM messages WHERE id = %s
    """
    values = (message_id,)

    message = db.fetch_one(query, values)

    if message:
        # Adding message author
        message['author'] = get_user_by_id(message['author_id'])

    return message


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
        id = create_id('notifications')
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


def create_attachment(attachment, parent_id):
    # Storing attachment in attachments folder
    app_root = os.path.dirname(os.path.abspath(__file__))
    folder = os.path.join(app_root, '../imgs/attachments/')

    parts = attachment.filename.split('.')[::-1]
    extension = parts[0]
    id = create_id('attachments')
    file_name = os.path.join(folder, str(id) + '.' + extension)
    
    attachment.save(file_name)

    # Inserting attachments into database
    query = "INSERT INTO attachments (id, parent_id, extension) VALUES (%s, %s, %s)"
    values = (id, parent_id, extension)

    db.insert(query, values)

    return id

def get_attachment_by_id(id: int):
    query = "SELECT * FROM attachments WHERE id = %s"
    values = (id,)

    attachment = db.fetch_one(query, values)

    return attachment
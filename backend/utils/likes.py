import time
from database import db

"""
Function to create like based on parent_id and user_id, currently allows
parnet_id to be of type post and comment.
"""
def create_like(parent_id: int, user_id: int, type: int):
    query = "INSERT INTO likes (parent_id, user_id, type, timestamp) VALUES (%s, %s, %s, %s)"
    values = (
        parent_id,
        user_id,
        type,
        time.time()
    )

    db.insert(query, values)

    return {
        'parent_id': parent_id,
        'user_id': user_id
    }

"""
Function to delete a like based on parent_id and user_id, currently allows
parnet_id to be of type post and comment.
"""
def delete_like(parent_id: int, user_id: int):
    query = "DELETE FROM likes WHERE parent_id = %s AND user_id = %s"
    values = (parent_id, user_id)

    db.delete(query, values)

    return {}

"""
Function to fetch a post or comment like based on id and user_id.
"""
def get_like(parent_id: int, user_id: int):
    query = "SELECT * FROM likes WHERE parent_id = %s AND user_id = %s"
    values = (
        parent_id,
        user_id
    )

    like = db.fetch_one(query, values)

    return like

"""
Function to get a post or comments total like count.
"""
def get_like_count(parent_id: int):
    query = "SELECT COUNT(*) AS count FROM likes WHERE parent_id = %s"
    values = (parent_id,)

    data = db.fetch_one(query, values)
    if data and 'count' in data:
        count = data['count']
    else:
        count = 0

    return count
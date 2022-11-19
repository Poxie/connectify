import time
from typing import Union
from database import db
from utils.common import get_post_by_id

SECONDS_IN_A_MINUTE = 60
MINUTES_IN_AN_HOUR = 60
HOURS_IN_A_DAY = 24
AMOUNT_OF_DAYS = 2

"""
Function to get the 'hottest' posts during the last 48 hours.
It sorts the most liked posts during this time period based on
like count and return a list of posts.
"""
def get_popular_posts(token_id: Union[int,None]=None, start_at=0, amount=15):
    # Timestamp from 48 hours ago
    timestamp = time.time() - (
        SECONDS_IN_A_MINUTE *
        MINUTES_IN_AN_HOUR *
        HOURS_IN_A_DAY *
        AMOUNT_OF_DAYS
    )

    # Fetching most liked posts within last 48 hours
    query = """
    SELECT
        p.id,
        COUNT(l.user_id) AS like_count
    FROM posts p
        LEFT JOIN likes l ON p.id = l.parent_id
    WHERE 
        p.timestamp > %s AND p.privacy = 'all'
    GROUP BY p.id
    ORDER BY like_count DESC
    LIMIT %s, %s
    """
    values = (timestamp, start_at, amount)

    data = db.fetch_all(query, values)
    if not data: 
        return []

    # Fetching post data
    posts = []
    post_ids = [item['id'] for item in data if 'id' in item]
    for post_id in post_ids:
        post = get_post_by_id(post_id, token_id)
        posts.append(post)

    return posts

def get_latest_posts(token_id: Union[int, None]=None, start_at=0, amount=15):
    # Fetching latest posts from database
    query = """
    SELECT id FROM posts WHERE privacy = 'all' ORDER BY timestamp DESC LIMIT %s, %s
    """
    values = (start_at, amount)

    data = db.fetch_all(query, values)
    if not data: 
        return []

    # Fetching post data
    posts = []
    post_ids = [item['id'] for item in data if 'id' in item]
    for post_id in post_ids:
        post = get_post_by_id(post_id, token_id)
        posts.append(post)

    return posts
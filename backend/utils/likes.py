import time
from database import db
from mysql.connector.cursor import MySQLCursorDict
from utils.users import get_user_by_id

# Creating post like
def create_post_like(post_id: int, user_id: int):
    cursor = MySQLCursorDict(db)

    # Creating query
    query = "INSERT INTO likes (post_id, user_id, timestamp) VALUES (%s, %s, %s)"
    values = (
        post_id,
        user_id,
        time.time()
    )

    # Executing create query
    cursor.execute(query, values)
    db.commit()

    return {
        'post_id': post_id,
        'user_id': user_id
    }

# Getting post likes
def get_post_likes(post_id: int, with_names=False):
    cursor = MySQLCursorDict(db)

    # Creating query
    query = "SELECT COUNT(*) AS like_count FROM likes WHERE post_id = %s"
    values = (post_id,)

    # Executing query
    cursor.execute(query, values)
    data = cursor.fetchone()

    # Getting like count
    like_count = 0
    if data:
        like_count = data['like_count']

    return like_count
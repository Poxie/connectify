import re
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

# Deleting post like
def delete_post_like(post_id: int, user_id: int):
    cursor = MySQLCursorDict(db)

    # Creating query
    query = "DELETE FROM likes WHERE post_id = %s AND user_id = %s"
    values = (post_id, user_id)

    # Executing delete query
    cursor.execute(query, values)
    db.commit()

    return {}

# Getting post likes
def get_post_like_count(post_id: int):
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

# Getting specific like
def get_post_like(post_id: int, user_id: int):
    cursor = MySQLCursorDict(db)

    # Creating query
    query = "SELECT * FROM likes WHERE post_id = %s AND user_id = %s"
    values = (
        post_id,
        user_id
    )

    # Fetching like
    cursor.execute(query, values)
    like = cursor.fetchone()
    cursor.reset()

    return like
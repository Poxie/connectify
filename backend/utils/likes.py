import time
from database import db

# Creating post like
def create_post_like(post_id: int, user_id: int):
    # Creating query
    query = "INSERT INTO likes (post_id, user_id, timestamp) VALUES (%s, %s, %s)"
    values = (
        post_id,
        user_id,
        time.time()
    )

    # Executing create query
    db.insert(query, values)

    return {
        'post_id': post_id,
        'user_id': user_id
    }

# Deleting post like
def delete_post_like(post_id: int, user_id: int):
    # Creating query
    query = "DELETE FROM likes WHERE post_id = %s AND user_id = %s"
    values = (post_id, user_id)

    # Executing delete query
    db.delete(query, values)

    return {}

# Getting post likes
def get_post_like_count(post_id: int):
    # Creating query
    query = "SELECT COUNT(*) AS like_count FROM likes WHERE post_id = %s"
    values = (post_id,)

    # Executing query
    data = db.fetch_one(query, values)

    # Getting like count
    like_count = 0
    if data:
        like_count = data['like_count']

    return like_count

# Getting specific like
def get_post_like(post_id: int, user_id: int):
    # Creating query
    query = "SELECT * FROM likes WHERE post_id = %s AND user_id = %s"
    values = (
        post_id,
        user_id
    )

    # Fetching like
    like = db.fetch_one(query, values)

    return like

# Getting like count
def get_user_like_count(user_id: int):
    query = """
    SELECT COUNT(*) AS count FROM posts
    JOIN likes ON posts.id = likes.post_id
    WHERE posts.author_id = %s
    """
    values = (user_id,)

    result = db.fetch_one(query, values)

    count = 0
    if result:
        count = result['count']

    return count
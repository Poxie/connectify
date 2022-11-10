import time
from database import db
from typing import Union, List
from utils.common import get_post_by_id, add_user_notification, create_id

"""
Function to fetch a user's posts. Amount (amount) and pivot position (start_at)
can be used for pagination. token_id can be used to personalize the posts, i.e.,
adding has_liked, is_following, etc.
"""
def get_user_posts(user_id: int, token_id: Union[int, None]=None, amount=10, start_at=0):
    query = "SELECT id FROM posts WHERE author_id = %s ORDER BY timestamp DESC LIMIT %s, %s"
    values = (user_id, start_at, amount)

    data = db.fetch_all(query, values)
    
    posts = []
    if data:
        post_ids = [item['id'] for item in data]
        for post_id in post_ids:
            post = get_post_by_id(post_id, token_id)
            posts.append(post)

    return posts

"""
Function to fetch a user's liked posts. Amount (amount) and pivot position (start_at)
can be used for pagination. token_id can be used to personalize the posts, i.e.,
adding has_liked, is_following, etc.
"""
def get_user_liked_posts(user_id: int, token_id: Union[int, None]=None, amount=10, start_at=0):
    query = "SELECT parent_id FROM likes WHERE user_id = %s AND type = 0 ORDER BY timestamp DESC LIMIT %s, %s"
    values = (user_id, start_at, amount)

    # Fetching likes
    likes = db.fetch_all(query, values)

    # Fetching every post from liked posts
    posts = []
    for like in likes:
        if not like: continue

        # Fetching post
        post_id = like['parent_id']
        post = get_post_by_id(post_id, token_id)
        if post:
            posts.append(post)

    return posts

"""
Function to fetch multiple user's posts. Amount (amount) and pivot position (start_at)
can be used for pagination. token_id can be used to personalize the posts, i.e.,
adding has_liked, is_following, etc. 
"""
def get_posts_by_users(user_ids: List[int], amount: int, start_at: int, token_id: Union[int, None]=None):
    if not len(user_ids):
        return []

    # Getting all posts from followed users
    where_values = [f'author_id = {id}' for id in user_ids if isinstance(id, int)]
    where_clause = ' or '.join(where_values)

    query = f"""
    SELECT posts.id FROM users
    INNER JOIN posts ON users.id = posts.author_id
    WHERE {where_clause} ORDER BY timestamp DESC LIMIT %s, %s
    """
    values = (start_at, amount)

    data = db.fetch_all(query, values)

    # Fetching post information
    posts = []
    for item in data:
        post = get_post_by_id(item['id'], token_id)
        posts.append(post)

    return posts

"""
Function to create a post. Required properties in post argument are
content, title, and author_id. After post creation, a notification is
created for people following the author of the post. Returned from the
function is a post dict.
"""
def create_post(post):
    id = create_id('posts')

    created_at = time.time()
    query = "INSERT INTO posts (id, author_id, title, content, timestamp) VALUES (%s, %s, %s, %s, %s)"
    values = (
        id,
        post['author_id'],
        post['title'],
        post['content'],
        created_at
    )

    db.insert(query, values)

    # Fetching created post
    post = get_post_by_id(id)

    # Creating notification for following users
    if post:
        add_user_notification(
            reference_id=id, 
            user_reference_id=post['author_id'],
            type=0,
            created_at=created_at
        )

    return post

"""
Function to delete a post. Information related to the post is also deleted, i.e.,
likes, comments, etc.
"""
def delete_post(post_id):
    post_query = "DELETE FROM posts WHERE id = %s"
    like_query = "DELETE FROM likes WHERE parent_id = %s"
    comment_query = "DELETE FROM comments WHERE post_id = %s"

    values = (post_id,)

    db.delete(post_query, values)
    db.delete(like_query, values)
    db.delete(comment_query, values)

    return {}
import re
import time
from database import db
from random import randrange
from typing import Union, List
from utils.likes import get_post_like_count, get_post_like
from utils.comments import get_post_comment_count
from utils.users import get_user_by_id, add_user_notification

# Hydrating posts with extra attributes
def hydrate_post(post, token_id: Union[int, None]=None):
    id = post['id']

    # Getting like count for post
    like_count = get_post_like_count(id)
    post['like_count'] = like_count

    # Getting post comment count
    comment_count = get_post_comment_count(post['id'])
    post['comment_count'] = comment_count

    # Getting author object
    author = get_user_by_id(post['author_id'], token_id)
    post['author'] = author

    # Checking if current user has liked post
    post['has_liked'] = False
    if token_id:
        like = get_post_like(id, token_id)
        if like:
            post['has_liked'] = True

    return post

# Getting post by id
def get_post_by_id(id: int, token_id: Union[int, None]=None):
    # Creating query
    query = "SELECT * FROM posts WHERE id = %s"
    values = (id,)

    # Fetching post
    post = db.fetch_one(query, values)

    # Updating post with extra attributes
    if post:
        post = hydrate_post(post, token_id)

    return post

# Getting many posts by many user ids
def get_posts_by_user_ids(user_ids: List[int], amount: int, start_at: int, token_id: Union[int, None]=None):
    if not len(user_ids):
        return []

    # Getting all posts from followed users
    where_values = [f'author_id = {id}' for id in user_ids]
    where_clause = ' or '.join(where_values)

    query = f"""
    SELECT posts.* FROM users
    INNER JOIN posts ON users.id = posts.author_id
    WHERE {where_clause} ORDER BY timestamp DESC LIMIT %s, %s
    """
    values = (start_at, amount)

    posts = db.fetch_all(query, values) or []

    # Hydrating posts
    for post in posts:
        post = hydrate_post(post, token_id)

    return posts

# Getting posts by user id
def get_posts_by_user_id(id: int, token_id: Union[int, None]=None, amount=10, start_at=0):
    # Creating query
    query = "SELECT * FROM posts WHERE author_id = %s ORDER BY timestamp DESC LIMIT %s, %s"
    values = (id, start_at, amount)

    # Fetching posts
    posts = db.fetch_all(query, values)

    # Updating posts with extra attributes
    for post in posts:
        post = hydrate_post(post, token_id)


    return posts

# Creating post id
POST_ID_LENGTh = 10
def create_post_id() -> int:
    opts = '0123456789'
    
    # Creating random id
    id = ''
    for i in range(POST_ID_LENGTh):
        id += opts[randrange(len(opts))]
    id = int(id)

    # Checking if id already exists
    post = get_post_by_id(id)
    if post:
        return create_post_id()

    # Else return created id
    return id

# Function to create post
def create_post(post):
    # Creating post id
    id = create_post_id()

    # Creating insert query
    created_at = time.time()
    query = "INSERT INTO posts (id, author_id, title, content, timestamp) VALUES (%s, %s, %s, %s, %s)"
    values = (
        id,
        post['author_id'],
        post['title'],
        post['content'],
        created_at
    )

    # Creating post
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

# Function to delete post
def delete_post(id):
    # Creating delete query
    query = "DELETE FROM posts WHERE id = %s; DELETE FROM likes WHERE post_id = %s"
    values = (id, id)

    # Executing delete query
    db.delete(query, values)

    return {}

# Getting user liked posts
def get_user_liked_posts(user_id: int, token_id: Union[int, None]=None, amount=10, start_at=0):
    # Creating query
    query = "SELECT post_id FROM likes WHERE user_id = %s ORDER BY timestamp DESC LIMIT %s, %s"
    values = (user_id, start_at, amount)

    # Fetching likes
    likes = db.fetch_all(query, values)
    print(likes)

    # If not likes, return empty list
    posts = []
    if not likes:
        return posts

    # Fetching every post from liked posts
    for like in likes:
        if not like: continue

        # Fetching post
        post_id = like['post_id']
        post = get_post_by_id(post_id, token_id)
        if post:
            posts.append(post)

    return posts
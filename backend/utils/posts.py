import time
from typing import Union, List
from database import db
from mysql.connector.cursor import MySQLCursorDict
from random import randrange
from utils.likes import get_post_like_count, get_post_like
from utils.users import get_user_by_id

# Getting post by id
def get_post_by_id(id: int, token_id: Union[int, None]=None):
    cursor = MySQLCursorDict(db)

    # Creating query
    query = "SELECT * FROM posts WHERE id = %s"
    values = (id,)

    # Fetching post
    cursor.execute(query, values)
    post = cursor.fetchone()

    # Updating post with extra attributes
    if post:
        # Getting like count for post
        like_count = get_post_like_count(id)
        post['like_count'] = like_count

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

# Getting many posts by many user ids
def get_posts_by_user_ids(user_ids: List[int]):
    cursor = MySQLCursorDict(db)

    # Getting all posts from followed users
    posts = []
    for id in user_ids:
        user_posts = get_posts_by_user_id(id)
        posts = posts + user_posts

    return posts

# Getting posts by user id
def get_posts_by_user_id(id: int, token_id: Union[int, None]=None):
    cursor = MySQLCursorDict(db)

    # Creating query
    query = "SELECT * FROM posts WHERE author_id = %s"
    values = (id,)

    # Fetching posts
    cursor.execute(query, values)
    posts = cursor.fetchmany(10)

    # Updating posts with extra attributes
    for post in posts:
        # Getting post likes
        like_count = get_post_like_count(post['id'])
        post['like_count'] = like_count

        # Getting author object
        author = get_user_by_id(id, token_id)
        post['author'] = author

        # Checking if current user has liked post
        post['has_liked'] = False
        if token_id:
            like = get_post_like(post['id'], token_id)
            if like:
                post['has_liked'] = True


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
    cursor = MySQLCursorDict(db)

    # Creating post id
    id = create_post_id()

    # Creating insert query
    query = "INSERT INTO posts (id, author_id, title, content, timestamp) VALUES (%s, %s, %s, %s, %s)"
    values = (
        id,
        post['author_id'],
        post['title'],
        post['content'],
        time.time()
    )

    # Creating post
    cursor.execute(query, values)
    db.commit()

    # Fetching created post
    post = get_post_by_id(id)

    return post

# Function to delete post
def delete_post(id):
    cursor = MySQLCursorDict(db)

    # Creating delete query
    query = "DELETE FROM posts WHERE id = %s"
    values = (id,)

    # Executing delete query
    cursor.execute(query, values)
    db.commit()

    return {}
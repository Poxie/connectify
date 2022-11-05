import time
from typing import Union
from database import db
from random import randrange
from utils.users import get_user_by_id

# Creating post id
COMMENT_ID_LENGTH = 10
def create_comment_id() -> int:
    opts = '0123456789'
    
    # Creating random id
    id = ''
    for i in range(COMMENT_ID_LENGTH):
        id += opts[randrange(len(opts))]
    id = int(id)

    # Checking if id already exists
    comment = get_comment_by_id(id)
    if comment:
        return create_comment_id()

    # Else return created id
    return id

# Hydrating comment objects
def hydrate_comment(comment, token_id: Union[int, None]=None):
    # Getting comment author object
    author = get_user_by_id(comment['author_id'])
    comment['author'] = author

    # Adding like status to comment
    comment['has_liked'] = False
    if token_id and select_comment_like(comment['id'], token_id):
        comment['has_liked'] = True

    return comment

# Getting comment by id
def get_comment_by_id(id: int, token_id: Union[int, None]=None):
    # Creating query
    query = "SELECT * FROM comments WHERE id = %s"
    values = (id,)

    # Fetching comment
    comment = db.fetch_one(query, values)

    # Hydrating comment
    if comment:
        comment = hydrate_comment(comment, token_id)

    return comment

# Getting post comments
def get_post_comments(post_id: int, token_id: Union[int, None]=None):
    # Creating query
    query = "SELECT * FROM comments WHERE post_id = %s ORDER BY timestamp DESC"
    values = (post_id,)

    # Fetching comments
    comments = db.fetch_all(query, values)

    # Hydrating comment object
    for comment in comments:
        if not comment: continue
            
        comment = hydrate_comment(comment, token_id)

    return comments

# Getting post comment count
def get_post_comment_count(post_id: int):
    # Creating query
    query = "SELECT COUNT(*) as comment_count FROM comments WHERE post_id = %s"
    values = (post_id,)

    # Executing query
    data = db.fetch_one(query, values)

    # Getting comment count
    comment_count = 0
    if data and 'comment_count' in data:
        comment_count = data['comment_count']

    return comment_count

# Creating post comment
def create_post_comment(post_id: int, data):
    # Creating comment id
    id = create_comment_id()

    # Creating query
    query = "INSERT INTO comments (id, post_id, author_id, content, timestamp) VALUES (%s, %s, %s, %s, %s)"
    values = (
        id,
        post_id,
        data['author_id'],
        data['content'],
        time.time()
    )

    # Inserting comment
    db.insert(query, values)

    # Fetching created comment
    comment = get_comment_by_id(id)
    
    return comment

def create_comment_like(comment_id: int, token_id: int):
    query = "INSERT INTO likes (post_id, user_id, timestamp) VALUES (%s, %s, %s)"
    values = (comment_id, token_id, time.time())

    db.insert(query, values)

def destroy_comment_like(comment_id: int, token_id: int):
    query = "DELETE FROM likes WHERE post_id = %s AND user_id = %s"
    values = (comment_id, token_id)

    db.delete(query, values)

def select_comment_like(comment_id: int, token_id: int):
    query = "SELECT * FROM likes WHERE post_id = %s AND user_id = %s"
    values = (comment_id, token_id)

    like = db.fetch_one(query, values)

    return like
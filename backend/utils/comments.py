import re
import time
from database import db
from mysql.connector.cursor import MySQLCursorDict
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
def hydrate_comment(comment):
    # Getting comment author object
    author = get_user_by_id(comment['author_id'])
    comment['author'] = author

    return comment

# Getting comment by id
def get_comment_by_id(id: int):
    # Creating query
    query = "SELECT * FROM comments WHERE id = %s"
    values = (id,)

    # Fetching comment
    comment = db.fetch_one(query, values)

    # Hydrating comment
    if comment:
        comment = hydrate_comment(comment)

    return comment

# Getting post comments
def get_post_comments(post_id: int):
    # Creating query
    query = "SELECT * FROM comments WHERE post_id = %s"
    values = (post_id,)

    # Fetching comments
    comments = db.fetch_all(query, values)

    # Hydrating comment object
    for comment in comments:
        if not comment: continue
            
        comment = hydrate_comment(comment)

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
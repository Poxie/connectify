from database import db
from mysql.connector.cursor import MySQLCursorDict
from random import randrange
import time

# Getting post by id
def get_post_by_id(id: int):
    cursor = MySQLCursorDict(db)

    # Creating query
    query = "SELECT * FROM posts WHERE id = %s"
    values = (id,)

    # Fetching post
    cursor.execute(query, values)
    post = cursor.fetchone()

    return post

# Getting posts by user id
def get_posts_by_user_id(id: int):
    cursor = MySQLCursorDict(db)

    # Creating query
    query = "SELECT * FROM posts WHERE owner_id = %s"
    values = (id,)

    # Fetching posts
    cursor.execute(query, values)
    posts = cursor.fetchmany(10)

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
    query = "INSERT INTO posts (id, owner_id, title, content, timestamp) VALUES (%s, %s, %s, %s, %s)"
    values = (
        id,
        post['owner_id'],
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
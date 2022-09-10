import time
from database import db
from mysql.connector.cursor import MySQLCursorDict
from random import randrange

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

# Getting comment by id
def get_comment_by_id(id: int):
    cursor = MySQLCursorDict(db)

    # Creating query
    query = "SELECT * FROM comments WHERE id = %s"
    values = (id,)

    # Fetching comment
    cursor.execute(query, values)
    comment = cursor.fetchone()

    return comment

# Getting post comments
def get_post_comments(post_id: int):
    cursor = MySQLCursorDict(db)

    # Creating query
    query = "SELECT * FROM comments WHERE post_id = %s"
    values = (post_id,)

    # Fetching comments
    cursor.execute(query, values)
    comments = cursor.fetchmany(10)

    return comments

# Creating post comment
def create_post_comment(post_id: int, data):
    cursor = MySQLCursorDict(db)

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
    cursor.execute(query, values)
    db.commit()

    # Fetching created comment
    comment = get_comment_by_id(id)
    
    return comment
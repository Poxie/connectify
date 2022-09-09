from database import db
from mysql.connector.cursor import MySQLCursorDict

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
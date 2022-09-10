import time
from mysql.connector.cursor import MySQLCursorDict
from database import db

# Getting specific follower
def get_follower(follower_id: int, followee_id: int):
    cursor = MySQLCursorDict(db)

    # Creating select query
    query = "SELECT * FROM followers WHERE follower_id = %s AND followee_id = %s"
    values = (follower_id, followee_id)

    # Fetching follow
    cursor.execute(query, values)
    follow = cursor.fetchone()

    return follow

# Creating follow
def create_follower(follower_id: int, followee_id: int):
    cursor = MySQLCursorDict(db)

    # Creating insert query
    query = "INSERT INTO followers (follower_id, followee_id, timestamp) VALUES (%s, %s, %s)"
    values = (
        follower_id,
        followee_id,
        time.time()
    )

    # Executing query
    cursor.execute(query, values)
    db.commit()

    # Returning created follower
    follow = get_follower(follower_id, followee_id)

    return follow

# Delete follow
def delete_follower(follower_id: int, followee_id: int):
    cursor = MySQLCursorDict(db)

    # Creating delete query
    query = "DELETE FROM followers WHERE follower_id = %s AND followee_id = %s"
    values = (follower_id, followee_id)

    # Executing delete query
    cursor.execute(query, values)
    db.commit()

    return {}

# Getting user follower count
def get_user_follower_count(user_id: int):
    cursor = MySQLCursorDict(db)

    # Creating select query
    query = "SELECT COUNT(*) as follower_count FROM followers WHERE followee_id = %s"
    values = (user_id,)

    # Fetching follower count
    cursor.execute(query, values)
    data = cursor.fetchone()

    # Determining follower count
    follower_count = 0
    if data:
        follower_count = data['follower_count']
        
    return follower_count
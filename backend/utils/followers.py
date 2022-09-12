import time
from mysql.connector.cursor import MySQLCursorDict
from database import db

# Getting specific follower
def get_follower(follower_id: int, followee_id: int):
    # Creating select query
    query = "SELECT * FROM followers WHERE follower_id = %s AND followee_id = %s"
    values = (follower_id, followee_id)

    # Fetching follow
    follow = db.fetch_one(query, values)

    return follow

# Creating follow
def create_follower(follower_id: int, followee_id: int):
    # Creating insert query
    query = "INSERT INTO followers (follower_id, followee_id, timestamp) VALUES (%s, %s, %s)"
    values = (
        follower_id,
        followee_id,
        time.time()
    )

    # Executing query
    db.insert(query, values)

    # Returning created follower
    follow = get_follower(follower_id, followee_id)

    return follow

# Delete follow
def delete_follower(follower_id: int, followee_id: int):
    # Creating delete query
    query = "DELETE FROM followers WHERE follower_id = %s AND followee_id = %s"
    values = (follower_id, followee_id)

    # Executing delete query
    db.delete(query, values)

    return {}

# Getting user follower count
def get_user_follower_count(user_id: int):
    # Creating select query
    query = "SELECT COUNT(*) as follower_count FROM followers WHERE followee_id = %s"
    values = (user_id,)

    # Fetching follower count
    data = db.fetch_one(query, values)

    # Determining follower count
    follower_count = 0
    if data and 'follower_count' in data:
        follower_count = data['follower_count']
        
    return follower_count

# Getting user followees
def get_user_followees(id: int):
    # Creating select query
    query = "SELECT followee_id FROM followers WHERE follower_id = %s"
    values = (id,)

    # Fetching followee_ids
    data = db.fetch_all(query, values)
    
    # Getting followee ids
    followee_ids = []
    if data:
        for item in data:
            if item and 'followee_id' in item:
                followee_ids.append(item['followee_id'])

    return followee_ids
import time
from database import db

"""
Function to create a follower. Arguments follower_id and followee_id are required.
follower_id is the id of the user getting followed, while followee_id is the id
of the user creating the following.
"""
def create_follower(follower_id: int, followee_id: int):
    query = "INSERT INTO followers (follower_id, followee_id, timestamp) VALUES (%s, %s, %s)"
    values = (
        follower_id,
        followee_id,
        time.time()
    )

    db.insert(query, values)

    # Fetching created follower
    follow = get_follower(follower_id, followee_id)

    return follow

"""
Function to create a follower. Arguments are same as above. 
"""
def delete_follower(follower_id: int, followee_id: int):
    query = "DELETE FROM followers WHERE follower_id = %s AND followee_id = %s"
    values = (follower_id, followee_id)

    db.delete(query, values)

    return {}

"""
Function to get a follower. Arguments are same as above.
"""
def get_follower(follower_id: int, followee_id: int):
    # Creating select query
    query = "SELECT * FROM followers WHERE follower_id = %s AND followee_id = %s"
    values = (follower_id, followee_id)

    # Fetching follow
    follow = db.fetch_one(query, values)

    return follow

"""
Function to get the followee ids of a user. Essentially returning
a list of user ids that are following the user_id inputted as argument.
"""
def get_user_followees(user_id: int):
    query = "SELECT GROUP_CONCAT(followee_id) AS followee_ids FROM followers WHERE follower_id = %s"
    values = (user_id,)

    data = db.fetch_one(query, values)

    # If no data, return empty list
    if data and 'followee_ids' in data and data['followee_ids'] is None:
        return []
    
    # Converting mysql string group to python list 
    followee_ids = [int(id) for id in data['followee_ids'].split(',')]

    return followee_ids
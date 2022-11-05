from database import db

def get_user_follower_count(user_id: int):
    # Creating select query
    query = "SELECT COUNT(*) as count FROM followers WHERE followee_id = %s"
    values = (user_id,)

    # Fetching follower count
    data = db.fetch_one(query, values)

    # Determining follower count
    count = 0
    if data and 'count' in data:
        count = data['count']
        
    return count

def get_user_like_count(user_id: int):
    query = """
    SELECT COUNT(*) AS count FROM posts
    JOIN likes ON posts.id = likes.post_id
    WHERE posts.author_id = %s
    """
    values = (user_id,)

    result = db.fetch_one(query, values)

    count = 0
    if result and 'count' in result:
        count = result['count']

    return count

def get_user_post_count(user_id: int):
    query = "SELECT COUNT(*) AS count FROM posts WHERE author_id = %s"
    values = (user_id,)

    result = db.fetch_one(query, values)

    count = 0
    if result and 'count' in result:
        count = result['count']

    return count
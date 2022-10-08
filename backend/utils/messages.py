from database import db

def get_channel_messages(channel_id: int):
    # Creating select query
    query = "SELECT * FROM messages WHERE channel_id = %s"
    values = (channel_id,)

    # Executing query
    messages = db.fetch_all(query, values)

    return messages
from flask import Blueprint, jsonify
from utils.messages import get_channel_messages

messages = Blueprint('messages', __name__)

@messages.get('/channels/<int:channel_id>/messages')
def get_messages(channel_id: int):
    messages = get_channel_messages(channel_id)
    return jsonify(messages)
from flask import Blueprint, jsonify, request
from utils.messages import get_channel_messages, create_channel_message
from utils.auth import token_required

messages = Blueprint('messages', __name__)

@messages.get('/channels/<int:channel_id>/messages')
def get_messages(channel_id: int):
    messages = get_channel_messages(channel_id)
    return jsonify(messages)

@messages.post('/channels/<int:channel_id>/messages')
@token_required
def add_message(channel_id: int, token_id: int):
    content = request.form.get('content')

    # Creating message
    data = {
        'channel_id': channel_id,
        'author_id': token_id,
        'content': content
    }
    message = create_channel_message(data)

    return jsonify(message)
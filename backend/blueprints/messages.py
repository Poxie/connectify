from flask import Blueprint, jsonify, request
from utils.messages import get_channel_messages, create_channel_message
from utils.channels import get_channel_by_id
from utils.auth import token_required

messages = Blueprint('messages', __name__)

@messages.get('/channels/<int:channel_id>/messages')
@token_required
def get_messages(channel_id: int, token_id: int):
    # Checking if channel exists
    channel = get_channel_by_id(channel_id)
    if not channel:
        return 'Channel does not exist.', 404
    
    # Checking if user is part of channel
    if channel and 'recipients' in channel:
        ids = [recipient['id'] for recipient in channel['recipients']]
        if token_id not in ids:
            return 'Unauthorized.', 401

    messages = get_channel_messages(channel_id)
    return jsonify(messages)

@messages.post('/channels/<int:channel_id>/messages')
@token_required
def add_message(channel_id: int, token_id: int):
    content = request.form.get('content')

    # Checking if channel exists
    channel = get_channel_by_id(channel_id)
    if not channel:
        return 'Channel does not exist.', 404

    # Checking if author can add message
    if 'recipients' in channel:
        ids = [recipient['id'] for recipient in channel['recipients']]
        if token_id not in ids:
            return 'Unauthorized.', 401

    # Creating message
    data = {
        'channel_id': channel_id,
        'author_id': token_id,
        'content': content
    }
    message = create_channel_message(data)

    return jsonify(message)
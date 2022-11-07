from flask import Blueprint, jsonify, request
from utils.channels import get_channel_by_id, increase_unread_count
from utils.messages import create_channel_message, get_channel_messages
from utils.auth import token_required

messages = Blueprint('messages', __name__)

@messages.get('/channels/<int:channel_id>/messages')
@token_required
def get_messages(channel_id: int, token_id: int):
    # Checking if channel exists
    channel = get_channel_by_id(channel_id, token_id)
    if not channel:
        return 'Channel does not exist.', 404

    # Getting options to fetch from
    amount = int(request.args.get('amount') or '50')
    start_at = int(request.args.get('start_at') or '0')

    messages = get_channel_messages(channel_id, amount=amount, start_at=start_at)
    return jsonify(messages)


@messages.post('/channels/<int:channel_id>/messages')
@token_required
def add_message(channel_id: int, token_id: int):
    content = request.form.get('content')

    # Making sure message cannot be empty
    if not content:
        return 'Content is a required field.', 400

    # Checking if channel exists
    channel = get_channel_by_id(channel_id, token_id)
    if not channel:
        return 'Channel does not exist.', 404

    # Updating recipient unread message count
    for recipient in channel['recipients']:
        if recipient['id'] == token_id:
            continue

        increase_unread_count(channel_id, recipient['id'])

    # Creating message
    data = {
        'channel_id': channel_id,
        'author_id': token_id,
        'content': content
    }
    message = create_channel_message(data)

    return jsonify(message)
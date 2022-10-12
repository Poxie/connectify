from flask import Blueprint, jsonify, request
from utils.auth import token_required
from utils.constants import DIRECT_MESSAGE_CHANNEL_TYPE
from utils.channels import create_channel, get_my_channels, get_channel_by_id

channels = Blueprint('channels', __name__)

@channels.get('/users/@me/channels')
@token_required
def get_channels(token_id: int):
    channels = get_my_channels(token_id)
    return jsonify(channels)

@channels.post('/users/@me/channels')
@token_required
def create_message_channel(token_id: int):
    recipient_id = int(request.form.get('recipient_id') or '')
    if not recipient_id:
        return 'recipient_id is required', 400

    type = int(request.form.get('type') or 1)

    channel = create_channel(type, token_id, recipient_id)

    return jsonify(channel)

@channels.get('/channels/<int:channel_id>')
@token_required
def get_channel(channel_id: int, token_id: int):
    # Checking if channel exists
    channel = get_channel_by_id(channel_id, token_id)
    if not channel:
        return 'Channel does not exist.', 404

    # Checking if user has access to channel
    recipient_ids = [recipient['id'] for recipient in channel['recipients']]
    if token_id not in recipient_ids:
        return 'Unauthorized.', 401

    return jsonify(channel)
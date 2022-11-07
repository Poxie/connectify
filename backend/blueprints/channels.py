import json
from flask import Blueprint, jsonify, request
from utils.auth import token_required
from utils.constants import DIRECT_MESSAGE_CHANNEL_TYPE
from utils.channels import get_channel_by_id, get_user_channels, create_channel, update_unread_count, increase_unread_count

channels = Blueprint('channels', __name__)

@channels.get('/users/@me/channels')
@token_required
def get_my_channels(token_id: int):
    channels = get_user_channels(token_id)
    return jsonify(channels)


@channels.post('/users/@me/channels')
@token_required
def create_message_channel(token_id: int):
    recipient_id = int(request.form.get('recipient_id') or '')
    if not recipient_id:
        return 'recipient_id is required', 400

    type = int(request.form.get('type') or '1')

    channel = create_channel(type, token_id, recipient_id)

    return jsonify(channel)


@channels.get('/channels/<int:channel_id>')
@token_required
def get_channel(channel_id: int, token_id: int):
    # Checking if channel exists
    channel = get_channel_by_id(channel_id, token_id)
    if not channel:
        return 'Channel does not exist.', 404

    return jsonify(channel)


@channels.patch('/channels/<int:channel_id>/unread')
@token_required
def remove_unread(channel_id: int, token_id: int):
    type = request.args.get('type') or 'set'

    result = None

    # Setting unread count
    if type == 'set':
        unread_count = request.form.get('unread_count')
        if not unread_count:
            return 'unread_count is a required field.', 400
        
        result = update_unread_count(channel_id, token_id, int(unread_count))

    # Increasing unread count
    if type == 'increase':
        result = increase_unread_count(channel_id, token_id)

    return jsonify(result)
from flask import Blueprint, jsonify, request
from utils.auth import token_required
from utils.constants import DIRECT_MESSAGE_CHANNEL_TYPE
from utils.channels import create_channel, get_my_channels

channels = Blueprint('channels', __name__, url_prefix='/users/@me/channels')

@channels.get('/')
@token_required
def get_channels(token_id: int):
    channels = get_my_channels(token_id)
    return jsonify(channels)

@channels.post('/')
@token_required
def create_message_channel(token_id: int):
    recipient_id = int(request.form.get('recipient_id') or '')
    if not recipient_id:
        return 'recipient_id is required', 400

    type = int(request.form.get('type') or 1)

    channel = create_channel(type, token_id, recipient_id)

    return jsonify(channel)
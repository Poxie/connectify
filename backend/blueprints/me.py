from flask import Blueprint, jsonify, request
from utils.auth import token_required
from utils.users import get_user_by_id
from utils.notifications import get_user_notifications, get_user_notification_count, reset_user_notification_count
from utils.followers import get_user_followees
from utils.posts import get_posts_by_users

me = Blueprint('me', __name__)

@me.get('/me')
@token_required
def get_me(token_id: int):
    user = get_user_by_id(token_id)
    return jsonify(user)


@me.get('/feed')
@token_required
def get_my_feed(token_id: int):
    amount = int(request.args.get('amount') or '50')
    start_at = int(request.args.get('start_at') or '0')

    # Getting ids of followed users
    followee_ids = get_user_followees(token_id)
    
    # Getting posts from followed users
    posts = get_posts_by_users(
        user_ids=followee_ids, 
        token_id=token_id, 
        amount=amount, 
        start_at=start_at
    )

    return jsonify(posts)


@me.get('/notifications')
@token_required
def get_my_notifications(token_id: int):
    amount = int(request.args.get('amount') or '50')
    start_at = int(request.args.get('start_at') or '0')

    notifications = get_user_notifications(token_id, amount, start_at)
    return jsonify(notifications)


@me.get('/notifications_count')
@token_required
def get_my_notification_count(token_id: int):
    count = get_user_notification_count(token_id)
    return jsonify(count)


@me.patch('/notifications/reset')
@token_required
def reset_my_notifications(token_id: int):
    reset_user_notification_count(token_id)
    return jsonify({'count': 0})
from flask import Blueprint, jsonify
from utils.auth import token_required
from utils.users import get_user_by_id
from utils.followers import get_user_followees
from utils.posts import get_posts_by_user_ids

me = Blueprint('me', __name__)

@me.get('/me')
@token_required
def get_me(token_id: int):
    # Getting user based on token id
    user = get_user_by_id(token_id)
    return jsonify(user)

@me.get('/feed')
@token_required
def get_my_feed(token_id: int):
    # Getting following ids
    followee_ids = get_user_followees(token_id)
    
    # Getting posts from followed users
    posts = get_posts_by_user_ids(followee_ids, token_id)

    # Sorting posts by timestamp
    posts = sorted(posts, key=lambda d: d['timestamp'], reverse=True)

    return posts
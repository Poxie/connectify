import re
from flask import Blueprint, jsonify
from utils2.auth import token_required
from utils2.users import get_user_by_id
from utils2.followers import get_follower, create_follower, delete_follower

followers = Blueprint('followers', __name__, url_prefix='/followers/<int:user_id>')

@followers.post('/')
@token_required
def create_follow(user_id: int, token_id: int):
    # Making sure users cant follow themselves
    if user_id == token_id:
        return 'You cannot follow yourself.', 403

    # Checking if user exists
    user = get_user_by_id(user_id)
    if not user:
        return 'User does not exist.', 404

    # Checking if user already follows user
    prev_follow = get_follower(token_id, user_id)
    if prev_follow:
        return 'You already follow this user.', 409

    # Creating follow
    follow = create_follower(token_id, user_id)

    return jsonify(follow)


@followers.delete('/')
@token_required
def delete_follow(user_id: int, token_id: int):
    # Checking if user exists
    user = get_user_by_id(user_id)
    if not user:
        return 'User does not exist.', 404

    # Checking if user is following user
    prev_follow = get_follower(token_id, user_id)
    if not prev_follow:
        return 'You are not following this user.', 409

    # Deleting follow
    follow = delete_follower(token_id, user_id)

    return jsonify(follow)
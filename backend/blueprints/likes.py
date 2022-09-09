import re
from flask import Blueprint, jsonify
from utils.posts import get_post_by_id
from utils.likes import create_post_like, get_post_like, delete_post_like
from utils.auth import token_required
from utils.checks import post_exists

likes = Blueprint('likes', __name__, url_prefix='/posts/<int:post_id>')

@likes.post('/likes')
@token_required
@post_exists
def create_like(post_id: int, token_id: int):
    # Checking if like already exists
    prev_like = get_post_like(post_id, token_id)
    if prev_like:
        return 'User has already liked this post.', 409

    # Creating like
    like = create_post_like(post_id, token_id)

    return jsonify(like)

@likes.delete('/likes')
@token_required
@post_exists
def delete_like(post_id: int, token_id: int):
    # Making sure like exists
    prev_like = get_post_like(post_id, token_id)
    if not prev_like:
        return 'User has not liked this post.', 409

    # Deleting like
    like = delete_post_like(post_id, token_id)

    return jsonify(like)
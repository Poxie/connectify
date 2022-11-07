from flask import Blueprint, jsonify
from utils.common import get_post_by_id
from utils.comments import get_comment_by_id
from utils.likes import create_like, delete_like, get_like
from utils.auth import token_required

post_likes = Blueprint('post_likes', __name__, url_prefix='/posts/<int:post_id>/likes')
comment_likes = Blueprint('comment_likes', __name__, url_prefix='/comments/<int:comment_id>/likes')

@post_likes.post('')
@token_required
def add_post_like(post_id: int, token_id: int):
    # Checking if post exists
    post = get_post_by_id(post_id)
    if not post:
        return 'Post does not exist.', 404

    # Checking if like already exists
    prev_like = get_like(post_id, token_id)
    if prev_like:
        return 'User has already liked this post.', 409

    # Creating like
    like = create_like(post_id, token_id)

    return jsonify(like)


@post_likes.delete('')
@token_required
def remove_post_like(post_id: int, token_id: int):
    # Checking if post exists
    post = get_post_by_id(post_id)
    if not post:
        return 'Post does not exist.', 404

    # Making sure like exists
    prev_like = get_like(post_id, token_id)
    if not prev_like:
        return 'User has not liked this post.', 409

    # Deleting like
    like = delete_like(post_id, token_id)

    return jsonify(like)


@comment_likes.post('')
@token_required
def like_comment(comment_id: int, token_id: int):
    # Checking if comment exists
    comment = get_comment_by_id(comment_id)
    if not comment:
        return 'Comment does not exist.', 404

    # Checking if user has liked
    like = get_like(comment_id, token_id)
    if like:
        return 'User has already liked this comment.', 409

    create_like(comment_id, token_id)
    return jsonify({})


@comment_likes.delete('')
@token_required
def unlike_comment(comment_id: int, token_id: int):
    # Checking if comment exists
    comment = get_comment_by_id(comment_id)
    if not comment:
        return 'Comment does not exist.', 404
        
    # Checking if user has liked
    like = get_like(comment_id, token_id)
    if not like:
        return 'User has not liked this comment.', 409

    delete_like(comment_id, token_id)
    return jsonify({})
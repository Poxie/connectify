from flask import Blueprint, request, jsonify
from utils.posts import get_post_by_id
from utils.comments import get_post_comments, create_post_comment, create_comment_like, destroy_comment_like, select_comment_like
from utils.auth import token_required
from utils.checks import post_exists

comments = Blueprint('comments', __name__)

@comments.get('/posts/<int:post_id>/comments')
@post_exists
def get_comments(post_id: int):
    # Fetching comments
    comments = get_post_comments(post_id)
    
    return comments

@comments.post('/posts/<int:post_id>/comments')
@token_required
@post_exists
def create_comment(post_id: int, token_id: int):
    content = request.form.get('content')

    # Checking if required fields are missing
    if not content:
        return 'Required fields may not be empty.', 400

    # Creating comment
    data = {
        'author_id': token_id,
        'content': content,
    }
    comment = create_post_comment(post_id, data)

    return jsonify(comment)

@comments.post('/comments/<int:comment_id>/likes')
@token_required
def like_comment(comment_id: int, token_id: int):
    # Checking if user has liked
    like = select_comment_like(comment_id, token_id)
    if like:
        return 'User has already liked this comment.', 409

    create_comment_like(comment_id, token_id)
    return '', 204

@comments.delete('/comments/<int:comment_id>/likes')
@token_required
def unlike_comment(comment_id: int, token_id: int):
    # Checking if user has liked
    like = select_comment_like(comment_id, token_id)
    if not like:
        return 'User has not liked this comment.', 409

    destroy_comment_like(comment_id, token_id)
    return jsonify({})
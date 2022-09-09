from flask import Blueprint, request, jsonify
from utils.posts import get_post_by_id
from utils.comments import get_post_comments, create_post_comment
from utils.auth import token_required
from utils.checks import post_exists

comments = Blueprint('comments', __name__, url_prefix='/posts/<int:post_id>')

@comments.get('/comments')
@post_exists
def get_comments(post_id: int):
    # Fetching comments
    comments = get_post_comments(post_id)
    
    return comments

@comments.post('/comments')
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
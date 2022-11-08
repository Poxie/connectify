from typing import Union
from flask import Blueprint, request, jsonify
from utils.common import get_post_by_id
from utils.comments import get_post_comments, create_post_comment
from utils.likes import get_like, create_like, delete_like
from utils.auth import token_required, token_optional

comments = Blueprint('comments', __name__)

@comments.get('/posts/<int:post_id>/comments')
@token_optional
def get_comments(post_id: int, token_id: Union[int, None]=None):
    # Checking if post exists
    post = get_post_by_id(post_id)
    if not post:
        return 'Post does not exist.', 404

    order_by = request.args.get('order_by') or 'top'
    start_at = int(request.args.get('start_at') or '0')
    amount = int(request.args.get('amount') or '15')

    # Fetching comments
    comments = get_post_comments(post_id, token_id, order_by, start_at=start_at, amount=amount)
    
    return comments


@comments.post('/posts/<int:post_id>/comments')
@token_required
def create_comment(post_id: int, token_id: int):
    content = request.form.get('content')

    # Checking if required fields are missing
    if not content:
        return 'Required fields may not be empty.', 400

    # Checking if post exists
    post = get_post_by_id(post_id)
    if not post:
        return 'Post does not exist.', 404

    # Creating comment
    data = {
        'author_id': token_id,
        'content': content,
    }
    comment = create_post_comment(post_id, data)

    return jsonify(comment)
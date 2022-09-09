from flask import Blueprint, jsonify
from utils.posts import get_post_by_id
from utils.likes import create_post_like
from utils.auth import token_required

likes = Blueprint('likes', __name__, url_prefix='/posts/<int:post_id>')

@likes.post('/likes')
@token_required
def create_like(post_id: int, token_id: int):
    # Checking if post exists
    post = get_post_by_id(post_id)
    if not post:
        return 'Post does not exist.', 404

    # Creating like
    like = create_post_like(post_id, token_id)

    return jsonify(like)
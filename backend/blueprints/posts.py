from flask import Blueprint, request, jsonify
from utils.auth import token_required
from utils.users import get_user_by_id
from utils.posts import create_post

posts = Blueprint('posts', __name__, url_prefix='/users/<int:id>')

# Create user post
@posts.post('/posts')
@token_required
def create_user_post(id: int):
    title = request.form.get('title')
    content = request.form.get('content')

    # Checking if required fields are missing
    if not title or not content:
        return 'Required fields may not be empty.', 400

    # Checking if user exists
    user = get_user_by_id(id)
    if not user:
        return 'User does not exist.', 404

    # Creating post
    data = {
        'title': title, 
        'content': content,
        'owner_id': id
    }
    post = create_post(data)

    return jsonify(post)
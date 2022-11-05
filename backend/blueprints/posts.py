from typing import Union
from flask import Blueprint, request, jsonify
from utils.auth import token_required, token_optional
from utils.users import get_user_by_id
from utils.posts import create_post, get_posts_by_user_id, get_post_by_id, delete_post

posts = Blueprint('posts', __name__)
user_posts = Blueprint('user_posts', __name__, url_prefix='/users/<int:id>')
posts.register_blueprint(user_posts)

# Create user post
MAX_CHARACTER_LENGTH = 400
@posts.post('/posts')
@token_required
def create_user_post(token_id: int):
    title = request.form.get('title')
    content = request.form.get('content')

    # Checking if required fields are missing
    if not title or not content:
        return 'Required fields may not be empty.', 400

    # Checking if content is too long
    if len(content) > MAX_CHARACTER_LENGTH:
        return f'Content may not exceed {MAX_CHARACTER_LENGTH} characters.', 400

    # Checking if user exists
    user = get_user_by_id(token_id)
    if not user:
        return 'User does not exist.', 404

    # Creating post
    data = {
        'title': title, 
        'content': content,
        'author_id': token_id
    }
    post = create_post(data)

    return jsonify(post)

# Delete user post
@posts.delete('/posts/<int:id>')
@token_required
def delete_user_post(id: int, token_id: int):
    # Making sure post exists
    post = get_post_by_id(id)
    if not post:
        return 'Post does not exist.', 404

    # Making sure logged in person is owner of post
    if post['author_id'] != token_id:
        return 'Unauthorized.', 401

    # Deleting post
    data = delete_post(id)

    return jsonify(data)

# Get post by id
@posts.get('/posts/<int:id>')
@token_optional
def get_post(id: int, token_id: Union[int, None]=None):
    # Getting post
    post = get_post_by_id(id, token_id)
    if not post:
        return 'Post does not exist.', 404

    return jsonify(post)

# Get user posts
@user_posts.get('/posts')
@token_optional
def get_user_posts(id: int, token_id: Union[int, None]=None):
    # Checking if user exists
    user = get_user_by_id(id)
    if not user:
        return 'User does not exist.', 404

    # Getting search parameters
    amount = int(request.args.get('amount') or '10')
    start_at = int(request.args.get('start_at') or '0')

    # Getting post
    posts = get_posts_by_user_id(id, token_id, amount=amount, start_at=start_at)

    return jsonify(posts)
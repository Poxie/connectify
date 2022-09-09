from flask import Blueprint, request, jsonify
from utils.auth import token_required
from utils.users import get_user_by_id
from utils.posts import create_post, get_posts_by_user_id, get_post_by_id

posts = Blueprint('posts', __name__)
user_posts = Blueprint('user_posts', __name__, url_prefix='/users/<int:id>')
posts.register_blueprint(user_posts)

# Create user post
@posts.post('/posts')
@token_required
def create_user_post(token_id: int):
    title = request.form.get('title')
    content = request.form.get('content')

    # Checking if required fields are missing
    if not title or not content:
        return 'Required fields may not be empty.', 400

    # Checking if user exists
    user = get_user_by_id(token_id)
    if not user:
        return 'User does not exist.', 404

    # Creating post
    data = {
        'title': title, 
        'content': content,
        'owner_id': token_id
    }
    post = create_post(data)

    return jsonify(post)

# Get post by id
@posts.get('/posts/<int:id>')
def get_post(id: int):
    # Getting post
    post = get_post_by_id(id)
    if not post:
        return 'Post does not exist.', 404

    return jsonify(post)

# Get user posts
@user_posts.get('/posts')
def get_user_post(id: int):
    # Checking if user exists
    user = get_user_by_id(id)
    if not user:
        return 'User does not exist.', 404

    # Getting post
    posts = get_posts_by_user_id(id)

    return jsonify(posts)
from typing import Union
from flask import Blueprint, request, jsonify
from utils.auth import token_required, token_optional
from utils.users import get_user_by_id
from utils.common import get_post_by_id
from utils.posts import get_user_posts, delete_post, create_post
from utils.constants import MAX_TITLE_LENGTH, MAX_CONTENT_LENGTH
from database import db

posts = Blueprint('posts', __name__)

@posts.post('/posts')
@token_required
def create_user_post(token_id: int):
    title = request.form.get('title')
    content = request.form.get('content')
    privacy = request.form.get('privacy') or 'all'

    # Checking if required fields are missing
    if not title or not content:
        return 'Required fields may not be empty.', 400

    # Checking if title is too long
    if len(title) > MAX_TITLE_LENGTH:
        return f'Title may not exceed {MAX_TITLE_LENGTH} characters.', 400

    # Checking if content is too long
    if len(content) > MAX_CONTENT_LENGTH:
        return f'Content may not exceed {MAX_CONTENT_LENGTH} characters.', 400

    # Checking if privacy setting is unsupported
    if privacy not in ['all', 'semi', 'private']:
        return 'Privacy setting is unsupported.', 400

    # Adding post attachments
    attachments = []
    for key, item in request.files.items(multi=True):
        if key != 'attachments': continue

        # Checking file extension
        parts = item.filename.split('.')[::-1]
        ext = parts[0]
        if ext.lower() not in ['jpg', 'png']:
            return 'Unsupported file format.', 400

        attachments.append(item)

    # Creating post
    data = {
        'title': title, 
        'content': content,
        'privacy': privacy,
        'author_id': token_id,
        'attachments': attachments
    }
    post = create_post(data)

    return jsonify(post)


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


@posts.get('/posts/<int:id>')
@token_optional
def get_post(id: int, token_id: Union[int, None]=None):
    # Getting post
    post = get_post_by_id(id, token_id)
    if not post:
        return 'Post does not exist.', 404

    return jsonify(post)


@posts.get('/users/<int:id>/posts')
@token_optional
def get_posts(id: int, token_id: Union[int, None]=None):
    # Checking if user exists
    user = get_user_by_id(id)
    if not user:
        return 'User does not exist.', 404

    # Getting search parameters
    amount = int(request.args.get('amount') or '10')
    start_at = int(request.args.get('start_at') or '0')

    posts = get_user_posts(id, token_id, amount=amount, start_at=start_at)

    return jsonify(posts)

@posts.patch('/posts/<int:post_id>')
@token_required
def update_post(post_id: int, token_id: int):
    properties = request.form.copy()

    post = get_post_by_id(post_id, token_id)
    if not post:
        return 'Post does not exist', 404

    if post['author_id'] != token_id:
        return 'Unauthorized.', 401

    update_query_string = []
    values = []
    for key, value in properties.items():
        # Making sure users can only update allowed properties
        if key not in ['privacy']:
            continue

        update_string = f'{key} = %s'
        update_query_string.append(update_string)
        values.append(value)

    update_string = ', '.join(update_query_string)
    query = f"UPDATE posts SET {update_string} WHERE id = %s"
    
    values.append(post_id)
    values = tuple(values)
    
    db.update(query, values)

    post = get_post_by_id(post_id)
    return jsonify(post)
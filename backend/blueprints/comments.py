from flask import Blueprint
from utils.posts import get_post_by_id
from utils.comments import get_post_comments

comments = Blueprint('comments', __name__, url_prefix='/posts/<int:post_id>')

@comments.get('/comments')
def get_comments(post_id: int):
    # Checking if post exists
    post = get_post_by_id(post_id)
    if not post:
        return 'Post does not exist.', 404

    # Fetching comments
    comments = get_post_comments(post_id)
    
    return comments
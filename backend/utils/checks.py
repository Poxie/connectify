import re
from textwrap import wrap
from flask import request
from functools import wraps
from utils.posts import get_post_by_id

def post_exists(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Checking if post id is present
        if not 'post_id' in kwargs:
            return 'Post id not found.', 400
        
        # Checking if post exists
        post_id = kwargs['post_id']
        post = get_post_by_id(post_id)
        if not post:
            return 'Post does not exist.', 404

        return f(*args, **kwargs)
    
    return decorated
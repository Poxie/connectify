from typing import Union
from flask import Blueprint, jsonify, request
from utils.auth import token_optional
from utils.explore import get_popular_posts

explore = Blueprint('explore', __name__)

@explore.get('/explore')
@token_optional
def popular_posts(token_id: Union[int, None]=None):
    start_at = int(request.args.get('start_at') or '0')
    amount = int(request.args.get('amount') or '15')

    posts = get_popular_posts(token_id, start_at=start_at, amount=amount)
    return jsonify(posts)
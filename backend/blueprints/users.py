from flask import Blueprint

users = Blueprint('users', __name__)

@users.route('/users/<int:id>')
def get_user(id: int):
    return { 'hello id': id }

@users.route('/users/<int:id>/friends/<int:friend_id>')
def get_user_friend(id: int, friend_id: int):
    return { 'hello id': id, 'hello friend id': friend_id, }
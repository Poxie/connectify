from flask import Flask, Blueprint
from blueprints.users import users
from blueprints.login import login
from blueprints.posts import posts
from blueprints.comments import comments

# Creating Flask app
app = Flask(__name__)

# Registering blueprints
app.register_blueprint(users)
app.register_blueprint(login)
app.register_blueprint(posts)
app.register_blueprint(comments)
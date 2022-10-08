import os
from flask import Flask
from flask_cors import CORS
from blueprints.me import me
from blueprints.users import users
from blueprints.login import login
from blueprints.posts import posts
from blueprints.likes import likes
from blueprints.comments import comments
from blueprints.followers import followers
from blueprints.channels import channels
from blueprints.messages import messages

# Creating Flask app
app = Flask(__name__)

# Setting up cors
CORS(app, resources={r'/*': {'origins': os.getenv('FRONTEND_ORIGIN')}})

# Registering blueprints
app.register_blueprint(me)
app.register_blueprint(users)
app.register_blueprint(login)
app.register_blueprint(posts)
app.register_blueprint(likes)
app.register_blueprint(comments)
app.register_blueprint(followers)
app.register_blueprint(channels)
app.register_blueprint(messages)
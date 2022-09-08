from flask import Flask, Blueprint
from blueprints.users import users

# Creating Flask app
app = Flask(__name__)

# Registering blueprints
app.register_blueprint(users)
import os, jwt
from flask import Flask, request
from flask_socketio import SocketIO, send, emit
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'verysecret'

socketio = SocketIO(app, cors_allowed_origins="*")

clients = {}

@socketio.on('direct_message')
def handle_message(message):
    # Making sure recipient_id is present
    if 'recipient_id' not in message or not 'author_id' in message:
        return print('ids are missing in message', message)

    # Getting essential ids
    recipient_id = message['recipient_id']

    # Making sure recipient is connected
    if recipient_id in clients:
        recipient_socket_id = clients[recipient_id]
        emit('direct_message', message, room=recipient_socket_id)
    
    # Sending message to self
    author_id = get_my_id()
    if author_id in clients:
        author_socket_id = clients[author_id]
        emit('direct_message', message, room=author_socket_id)
    
@socketio.on('DM_CHANNEL_CREATED')
def handle_channel_created(message):
    # Making sure ids are present
    if 'recipient_id' not in message:
        return print('recipient_id is missing in message', message)

    # Making sure channel_id is present
    if 'channel_id' not in message:
        return print('channel_id is missing in message ', message)

    # Getting recipient id
    recipient_id = message['recipient_id']

    # Checkiung if recipient is connected
    if recipient_id in clients:
        # Sending channel create event
        recipient_socket_id = clients[recipient_id]
        emit('DM_CHANNEL_CREATED', message['channel_id'], room=recipient_socket_id)

@socketio.on('connect')
def handle_connect():
    # Setting up user_id and socket_id relations on connect
    id = get_my_id()
    socket_id = request.sid
    clients[id] = socket_id

# Getting id from self token
def get_my_id():
    token = request.args.get('token')
    if not token:
        return

    # Checking if token is valid
    id = None
    try:
        data = jwt.decode(token, os.getenv('JWT_SECRET_KEY') or '', algorithms=['HS256'])
        id = data['id']
            
    except Exception as e:
        print(e)
        return 'Authorization token is invalid.', 401

    return id

if __name__ == '__main__':
    socketio.run(app, port=8000)
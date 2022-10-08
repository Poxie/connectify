from flask import Flask, request
from flask_socketio import SocketIO, send, emit

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
    recipient_id = str(message['recipient_id'])
    author_id = str(message['author_id'])

    # Making sure recipient is connected
    if recipient_id in clients:
        recipient_socket_id = clients[recipient_id]
        emit('direct_message', message, room=recipient_socket_id)
    
    # Sending message to self
    if author_id in clients:
        author_socket_id = clients[author_id]
        emit('direct_message', message, room=author_socket_id)

@socketio.on('connect')
def handle_connect():
    # Setting up user_id and socket_id relations on connect
    id = request.args.get('id')
    socket_id = request.sid
    clients[id] = socket_id

if __name__ == '__main__':
    socketio.run(app, port=8000)
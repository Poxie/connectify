import os, jwt, ssl, smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import Blueprint, request, jsonify
from utils.users import get_user_by_username
from utils.auth import token_required
from cryptography.fernet import Fernet
f = Fernet(os.getenv('CRYPTOGRAPHY_KEY') or '')

login = Blueprint('login', __name__)

@login.post('/login')
def user_login():
    username = request.form.get('username')
    password = request.form.get('password')

    # If fields are empty, return bad request
    if not username or not password:
        return 'Required fields may not be empty.', 400

    # Getting user by username
    user = get_user_by_username(username, True)

    # If user does not exist
    if not user:
        return 'Login details are incorrect.', 409
    
    # Comparing hashed password with user inputted password
    if f.decrypt(user['password']) != password.encode('utf-8'):
        return 'Login details are incorrect.', 409
    
    # Creating user access token
    token = jwt.encode({ 'id': user['id'] }, os.getenv('JWT_SECRET_KEY') or '')

    return jsonify({ 'token': token })

EMAIL_SENDER = os.environ.get('EMAIL_SENDER')
EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD')
@login.post('/reset_password')
@token_required
def reset_password(token_id: int):
    email_receiver = request.form.get('email')
    if not email_receiver:
        return 'Email is required.', 400

    # Creating reset token
    payload = {
        'email': email_receiver,
        'user_id': token_id
    }
    token = jwt.encode(payload, os.environ.get('JWT_SECRET_KEY'))

    # Creating reset url
    reset_url = os.environ.get('FRONTEND_ORIGIN') + '/reset-password?token=' + token

    # Creating email content
    subject = 'Reset password'
    text = "Do you want to reset your password?\n\nUse the link below to reset your password for your account.\n\n" + reset_url
    html = f"""\
    <html>
        <head></head>
        <body>
            <h4>Do you want to reset your password?</h4>
            <p>
                Use the link below to reset your password for your account.
            </p>
            <a href="{reset_url}">
                Click here to reset your password.
            </a>
        </body>
    </html>
    """

    # Hydrating email with values
    message = MIMEMultipart('alternative')
    message['From'] = EMAIL_SENDER
    message['To'] = 'poxen12@hotmail.com'
    message['Subject'] = subject

    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')

    message.attach(part1)
    message.attach(part2)

    context = ssl.create_default_context()

    # Sending reset mail
    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(EMAIL_SENDER, EMAIL_PASSWORD)
        smtp.sendmail(EMAIL_SENDER, email_receiver, message.as_string())
        
        return jsonify({})
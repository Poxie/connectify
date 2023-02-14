import jwt, os
from flask import request
from functools import wraps

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token_missing = 'Authorization token is missing', 401

        # Checking if token is missing
        if not 'Authorization' in request.headers:
            return token_missing

        authorization = request.headers.get('Authorization')
        if not authorization or len(authorization.split(' ')) < 2:
            return 'Authorization token is missing.', 401

        token = authorization.split(' ')[1]

        if not token:
            return 'Authorization token is missing.', 401

        # Checking if token is valid
        try:
            data = jwt.decode(token, os.getenv('JWT_SECRET_KEY') or '', algorithms=['HS256'])
            kwargs['token_id'] = data['id']
                
        except Exception as e:
            print(e)
            return 'Authorization token is invalid.', 401

        return f(*args, **kwargs)

    return decorator

def token_optional(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        # Checking if authorization headers are present
        if not 'Authorization' in request.headers:
            return f(*args, **kwargs)

        # Checking if token is present
        authorization = request.headers.get('Authorization')
        if not authorization or len(authorization.split(' ')) < 2:
            return f(*args, **kwargs)

        # Checking if token is present
        token = authorization.split(' ')[1]
        if not token:
            return f(*args, **kwargs)

        # Setting token_id on successful decode
        try:
            data = jwt.decode(token, os.getenv('JWT_SECRET_KEY') or '', algorithms=['HS256'])
            kwargs['token_id'] = data['id']
                
        except Exception as e:
            print(e)
            pass

        return f(*args, **kwargs)
    
    return decorator
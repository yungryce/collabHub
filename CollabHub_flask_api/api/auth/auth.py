from flask import Blueprint, request, jsonify
from models.users import UserModel
from models.blacklist import BlacklistToken
from api.response_utils import validate_json, response_info
from api.auth.auth_utils import authenticate
import os, jwt
from datetime import datetime, timedelta


auth_views = Blueprint("auth_views", __name__, url_prefix="/api/auth")

# Get the secret key from the environment variables
SECRET_KEY = os.getenv('SECRET_KEY')

@auth_views.route('/user', methods=['GET'])
@authenticate
def get_user():
    """
    Get details of the currently authenticated user.

    Returns:
        JSON response with the user details, or error response if authentication fails
    """
    try:
        # Get the authenticated user from the request
        user = request.current_user

        # Check if the user exists
        if user:
            # Serialize the user object to a JSON-compatible dictionary
            user_data = user.to_json()
            return jsonify(response_info(200, data=user_data))
        else:
            return jsonify(response_info(404, message='User not found'))
    except Exception as e:
        return jsonify(response_info(500, message='Failed to fetch user details'))
    
@auth_views.route('/users/<user_id>/username', methods=['GET'])
def get_username(user_id):
    """
    Get the username for the specified user ID.

    Args:
        user_id (str): The ID of the user whose username is to be fetched.

    Returns:
        JSON response with the username, or error response if user is not found.
    """
    try:
        # Find the user with the specified ID
        user = User.query.filter_by(id=user_id).first()

        # Check if the user exists
        if user:
            # Return the username
            return jsonify(response_info(200, data=user.username))
        else:
            return jsonify(response_info(404, message='User not found'))
    except Exception as e:
        return jsonify(response_info(500, message='Failed to fetch username'))


@auth_views.route('/register', methods=['POST'])
def register():
    """
    Create a new user.

    Returns:
        JSON response with the created user, or error response if validation fails
    """
    error = validate_json('username', 'email', 'password', 'first_name', 'last_name')
    if error:
        return error
    # Parse input data after validation
    data = request.get_json()
    username=data['username'],
    email=data['email']
    
    # Check if the username or email already exists
    if UserModel.get_first(username=username) or UserModel.get_first(email=email):
            error_message = 'Username or Email already exists'
            return jsonify(response_info(409, message=error_message))
    
    # Proceed to create a new user since neither the username nor email are taken
    new_user = UserModel(
        username=username,
        email=email,
        password=data['password'],
        first_name=data['first_name'],
        last_name=data['last_name']
    )
    
    # Save the new user to the database
    try:
        new_user.save()
        return jsonify(response_info(201, message='User registered successfully'))
    except Exception as e:
        # Handle any errors that occur during the save operation
        error_message = 'Failed to register user: {}'.format(str(e))  # Construct error message
        return jsonify(response_info(500, message=error_message))


@auth_views.route('/login', methods=['POST'])
def login():
    error = validate_json('username', 'password')
    if error:
        return error
    
    # Parse input data after validation
    data = request.get_json()
    username=data['username']

    user = UserModel.get_first(username=username)
    
    if user and user.check_password(data['password']):
        # Generate tokens
        try:
            payload = {
                'exp': datetime.utcnow() + timedelta(days=1, seconds=5),
                'iat': datetime.utcnow(),
                'sub': user.id
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        except Exception as e:
            error_message = 'Failed to generate Token: {}'.format(str(e))  # Construct error message
            return jsonify(response_info(500, message=error_message))

        # Serialize the user object to a JSON-compatible dictionary
        user_data = user.to_json()
        
        if user_data:
            return jsonify(response_info(200, message='Login successful', data={
                'token': token,
                'user': user_data
            }))
        else:
            error_message = 'Failed to serialize user data'
            return jsonify(response_info(500, message=error_message))
        
    else:
        error_message = 'Invalid username or password'
        return jsonify(response_info(401, message=error_message))


@auth_views.route('/logout', methods=['POST'])
@authenticate
def logout():
    """
    Log out the current user.
    """
    token = request.token

    # Add the token to the blacklist
    try:
        blacklisted_token = BlacklistToken(token=token)
        blacklisted_token.save()
        return jsonify(response_info(200, message='Logged out successfully'))
    except Exception as e:
        error_message = 'Failed to logout: {}'.format(str(e))
        return jsonify(response_info(500, message=error_message))

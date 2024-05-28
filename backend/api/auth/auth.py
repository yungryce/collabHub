from flask import Blueprint, request, jsonify, current_app
from models.users import UserModel
from models.blacklist import BlacklistToken
from api.response_utils import validate_json, response_info
from api.auth.auth_utils import authenticate
import os, jwt
from datetime import datetime, timedelta


auth_views = Blueprint("auth_views", __name__, url_prefix="/api/auth")

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
            return jsonify(response_info(200, message='Successful' , data=user_data))
        else:
            return jsonify(response_info(404, message='Error', error='User not found'))
    except Exception as e:
        return jsonify(response_info(500, message='Error', error='Failed to fetch user details'))
    
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
            return jsonify(response_info(200, message='Successful', data=user.username))
        else:
            return jsonify(response_info(404, message='Error', error='User not found'))
    except Exception as e:
        return jsonify(response_info(500, message='Error', error='Failed to fetch user details'))


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
            return jsonify(response_info(409, message='Error', error=error_message))
    
    # Proceed to create a new user since neither the username nor email are taken
    new_user = UserModel(
        username=username,
        email=email,
        password=data['password'],
        first_name=data['first_name'],
        last_name=data['last_name']
    )
    
    # Get the IP address of the request
    ip_address = request.remote_addr
    
    # Save the new user to the database
    try:
        mail_service = current_app.mail_service
        token = mail_service.generate_verification_token()
        mail_service.send_signup_verification(email, token, ip_address)
        new_user.verification_token = token
        new_user.save()
        return jsonify(response_info(201, message='Successful'))
    except Exception as e:
        # Handle any errors that occur during the save operation
        error_message = 'Failed to register user: {}'.format(str(e))  # Construct error message
        return jsonify(response_info(500, message='Error', error=error_message))


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
            secret_key = current_app.config['SECRET_KEY']
            token = jwt.encode(payload, secret_key, algorithm='HS256')
        except Exception as e:
            error_message = 'Failed to generate Token: {}'.format(str(e))  # Construct error message
            return jsonify(response_info(500, message='Error', error=error_message))

        # Serialize the user object to a JSON-compatible dictionary
        user_data = user.to_json()
        
        if user_data:
            return jsonify(response_info(200, message='Successful', data={
                'token': token,
                'user': user_data
            }))
        else:
            error_message = 'Failed to serialize user data'
            return jsonify(response_info(500, message='Error', error=error_message))
        
    else:
        error_message = 'Invalid username or password'
        return jsonify(response_info(401, message='Error', error=error_message))


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
        return jsonify(response_info(200, message='Successful'))
    except Exception as e:
        error_message = 'Failed to logout: {}'.format(str(e))
        return jsonify(response_info(500, message='Error', error=error_message))


@auth_views.route('/verify-registration', methods=['POST'])
def verify_registration():
    """
    Verify user registration using a verification token.

    Returns:
        JSON response indicating success or failure of verification
    """
    # Extract token from the request data
    token = request.json.get('token')

    # Check if token is provided
    if not token:
        return jsonify(response_info(400, message='Error', error='Verification token is required'))

    # Retrieve the user associated with the token
    user = UserModel.query.filter_by(verification_token=token).first()

    # Check if user exists
    if not user:
        return jsonify(response_info(404, message='Error', error='Invalid verification token'))

    # Check if the user is already verified
    if user.is_verified:
        return jsonify(response_info(200, message='User already verified'))

    # Mark the user as verified and save to the database
    user.is_verified = True
    user.save()

    return jsonify(response_info(200, message='Successful'))
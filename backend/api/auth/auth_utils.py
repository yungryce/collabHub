import os, jwt
from functools import wraps
from flask import request, jsonify
from models.users import UserModel, UserRole
from models.tasks import TaskModel
from api.response_utils import validate_json, response_info
from models.blacklist import BlacklistToken


# Get the secret key from the environment variables
SECRET_KEY = os.getenv('SECRET_KEY')


def authenticate(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
            if BlacklistToken.check_blacklist(token):
                return jsonify({'error': 'Token is blacklisted'}), 401
            request.token = token
        else:
            return jsonify({'error': 'Token is missing or invalid'}), 401
        try:
            # Decode and verify token
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('sub')
            
            # Fetch user from database using user_id
            user = UserModel.query.get(user_id)

            # Attach user object to request for later use
            request.current_user = user
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        # Call the original function with any provided arguments
        return func(*args, **kwargs)

    return wrapper


def authorize(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        """
        Check if the user is authorized to perform the action.

        Args:
            user: The user attempting to perform the action
            task: The task associated with the action

        Returns:
            If user is authorized, calls the original function.
            If user is not authorized, returns an error response.
        """
        user = request.current_user
        
        task_id = kwargs.get('task_id')
        if not task_id:
            return jsonify({'error': 'Task ID is missing'}), 400
        
        task = TaskModel.get_first(id=task_id)
        if not task:
            return jsonify({'error': 'Task not found'}), 404

        # Check if the user is an admin
        if user.role == UserRole.ADMIN:
            return func(*args, **kwargs)

        # Check if the user is the only assigned user to the task
        if len(task.users) == 1:
            return func(*args, **kwargs)
        
        # Flag to indicate if any assigned user has a role hierarchy greater than the current user
        unauthorized = False
        
        # If the user is assigned to the task, check their role against the task's assigned users
        for assigned_user in task.users:
            if UserRole.compare_roles(user.role, assigned_user.role) < 0:
                unauthorized = True
                break
        
        if unauthorized:
            return jsonify(response_info(403, error='You are not authorized to perform this action, as it involves users with higher role hierarchy', message='Unauthorized'))
        else:
            # Check if the current user is the creator of the task
            if task.created_by == user.id:
                return func(*args, **kwargs)
            else:
                return jsonify(response_info(403, error='Only the user who created the task can perform this action', message='Unauthorized'))

    return wrapper




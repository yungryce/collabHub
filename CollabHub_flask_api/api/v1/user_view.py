#!/usr/bin/python3
"""
Task API endpoints.

This module defines API endpoints for managing tasks.

Endpoints:
    - GET /api/v1/tasks: Get all tasks
    - GET /api/v1/tasks/<task_id>: Get a specific task by ID
    - POST /api/v1/tasks: Create a new task
    - PUT /api/v1/tasks/<task_id>: Update an existing task
    - DELETE /api/v1/tasks/<task_id>: Delete a task
"""

from flask import jsonify, request
from models.tasks import TaskModel, TaskStatus
from models.users import UserModel
from api.v1 import user_views
from api.response_utils import validate_json, response_info
from api.auth.auth_utils import authenticate, authorize
from sqlalchemy import or_


@user_views.route('/exists', methods=['GET'])
@authenticate
def check_user_exists():
    """
    Check if a user exists using a username or email.

    Query Parameters:
        - identifier (str): The username or email of the user to check.

    Returns:
        JSON response with a boolean indicating whether the user exists or not.
    """
    try:
        # Get the identifier from the query parameters
        identifier = request.args.get('identifier')

        # Check if the identifier is provided
        if not identifier:
            return jsonify(response_info(400, message='Error', error='Identifier is missing'))

        # Check if a user with the provided username or email exists
        user = UserModel.query.filter(or_(UserModel.username == identifier, UserModel.email == identifier)).first()

        # If user exists, return their ID
        if user:
            return jsonify(response_info(200, message='Successful', data=user.id))
        else:
            return jsonify(response_info(404, message='Error', error=f'User {identifier} not found'))
    except Exception as e:
        return jsonify(response_info(500, message='Error', error='Failed to check if user exists'))


@user_views.route('/', methods=['GET'])
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
            return jsonify(response_info(200, message='Successful', data=user_data))
        else:
            return jsonify(response_info(404, message='Error', error='User not found'))
    except Exception as e:
        return jsonify(response_info(500, message='Error', error='Failed to fetch user details'))
    
    
@user_views.route('<user_id>/username', methods=['GET'])
@authenticate
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
        user = UserModel.get_first(id=user_id)

        # Check if the user exists
        if user:
            # Return the username
            return jsonify(response_info(200, message='Successful' , data=user.username))
        else:
            return jsonify(response_info(404, message='Error', error='User not found'))
    except Exception as e:
        return jsonify(response_info(500, message='Error', error='Failed to fetch user details'))
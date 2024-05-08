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
            return jsonify(response_info(200, data=user_data))
        else:
            return jsonify(response_info(404, message='User not found'))
    except Exception as e:
        return jsonify(response_info(500, message='Failed to fetch user details'))
    
    
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
            return jsonify(response_info(200, data=user.username))
        else:
            return jsonify(response_info(404, message='User not found'))
    except Exception as e:
        return jsonify(response_info(500, message='Failed to fetch username'))
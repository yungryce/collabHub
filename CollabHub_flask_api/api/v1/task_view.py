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

from flask import abort, jsonify, request
from models.tasks import TaskModel, TaskStatus
from models.users import UserModel
from api.v1 import app_views
from api.response_utils import validate_json
from api.auth.auth_utils import authenticate, authorize

# Modify the route to use the authentication decorator
@app_views.route('/', methods=['GET'], strict_slashes=False)
@authenticate
def get():
    # Retrieve the authenticated user from the request context
    user = request.current_user

    # Fetch all tasks related to the authenticated user
    tasks = user.tasks
    tasks_json = [task.to_json() for task in tasks]

    return jsonify(tasks_json), 200



@app_views.route('/<task_id>', methods=['GET'], strict_slashes=False)
@authenticate
def get_task(task_id):
    """
    Get a task by ID.

    Args:
        task_id (str): Task ID

    Returns:
        JSON response with the task, or 404 if not found
    """
    # Retrieve the authenticated user from the request context
    user = request.current_user

    # Fetch the task by ID
    task = TaskModel.get_first(id=task_id)
    # Check if the task exists and is associated with the authenticated user
    if not task or user not in task.users:
        return jsonify({'error': 'Task not found'}), 404

    return jsonify(task.to_json()), 200



@app_views.route('/', methods=['POST'], strict_slashes=False)
@authenticate
def create_task():
    """
    Create a new task.
    
    Args:
        task_id (str): Task ID

    Returns:
        JSON response with the created task, or error response if validation fails
    """
    error = validate_json('title', 'description', 'status')
    if error:
        return error

    # Parse input data after validation
    data = request.get_json()
    title = data['title']
    description = data['description']
    assigned_users = data.get('assigned_users', [])
    
    new_task = TaskModel(title=title, description=description)
    
    # Associate the task with the current user    
    user = request.current_user
    user.tasks.append(new_task)
    
    # Assign the task to additional users
    for user_id in assigned_users:
        assigned_user = UserModel.get_first(id=user_id)
        if assigned_user:
            assigned_user.tasks.append(new_task)

    new_task.save()

    return jsonify(new_task.to_json()), 201


@app_views.route('/<task_id>', methods=['PUT'], strict_slashes=False)
@authenticate
def update_task(task_id):
    """
    Update an existing task.

    Args:
        task_id (str): Task ID

    Returns:
        JSON response with the updated task, or error response if validation fails or task not found
    """
    task = TaskModel.get_first(id=task_id)
    if not task:
        abort(404, description="Task not found")

    error = validate_json('title', 'description', 'status')
    if error:
        return error

    # Parse input data after validation
    data = request.get_json()
    
    status = data['status']
    if status and status not in TaskStatus._value2member_map_:
        return jsonify({'error': 'Invalid status value'}), 400
    
    task.title = data['title']
    task.description = data['description']
    assigned_users = data.get('assigned_users', [])
    task.status = TaskStatus(status)
    
    # Update assigned users if 'assigned_users' field is present
    assigned_users = data.get('assigned_users')
    if assigned_users:
        # Get the IDs of users already assigned to the task
        current_assigned_user_ids = {user.id for user in task.users}

        # Iterate through the new assigned users
        for user_id in assigned_users:
            # Check if the user is not already assigned to the task
            if user_id not in current_assigned_user_ids:
                user = UserModel.get_first(id=user_id)
                if user:
                    task.users.append(user)
    task.save()

    return jsonify(task.to_json()), 200


@app_views.route('/<task_id>', methods=['DELETE'], strict_slashes=False)
@authenticate
@authorize
def delete_task(task_id):
    """
    Delete a task.

    Args:
        task_id (str): Task ID

    Returns:
        JSON response with success message, or error response if task not found
    """
    task = TaskModel.get_first(id=task_id)
    if not task:
        abort(404, description="Task not found")

    # Remove associated users from the task
    task.users.clear()
    task.save()

    # Delete the task itself
    task.delete()

    return jsonify({'message': 'Task deleted successfully'}), 200

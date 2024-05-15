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
from api.v1 import task_views
from api.response_utils import validate_json, response_info
from api.auth.auth_utils import authenticate, authorize

# Modify the route to use the authentication decorator
@task_views.route('/', methods=['GET'], strict_slashes=False)
@authenticate
def get_all_tasks():
    # Retrieve the authenticated user from the request context
    user = request.current_user

    # Fetch all tasks related to the authenticated user
    tasks = user.tasks
    tasks_json = [task.to_json() for task in tasks]

    # Check if there are any tasks
    if tasks_json:
        return jsonify(response_info(200, message='Successful', data=tasks_json))
    else:
        return jsonify(response_info(404, message='Error', error='No tasks found'))


@task_views.route('/status/<status>', methods=['GET'], strict_slashes=False)
@authenticate
def get_tasks_by_status(status):
    # Retrieve the authenticated user from the request context
    user = request.current_user

    # Validate the status parameter
    if status not in TaskStatus.__members__:
        return jsonify(response_info(400, message='Error', error=f'Invalid status: {status}'))

    # Fetch tasks for the authenticated user filtered by status
    filtered_tasks = TaskModel.get_tasks_for_user_by_status(user, TaskStatus[status.upper()])

    # Convert tasks to JSON format
    tasks_json = [task.to_json() for task in filtered_tasks]
    
    # Check if there are any tasks
    if tasks_json:
        return jsonify(response_info(200, message='Successful', data=tasks_json))
    else:
        return jsonify(response_info(404, message='Error', error=f'No tasks found with status {status}'))


@task_views.route('/<task_id>', methods=['GET'], strict_slashes=False)
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
        return jsonify(response_info(404, message='Error', error='Task not found'))

    return jsonify(response_info(200, message='Successful', data=task.to_json()))



@task_views.route('/', methods=['POST'], strict_slashes=False)
@authenticate
def create_task():
    """
    Create a new task.
    
    Args:
        task_id (str): Task ID

    Returns:
        JSON response with the created task, or error response if validation fails
    """
    error = validate_json('title', 'description', 'start', 'end')
    if error:
        return error

    # Parse input data after validation
    data = request.get_json()
    title = data['title']
    description = data['description']
    start = data['start']
    end = data['end']
    assigned_users = data.get('user_ids', [])
    
    user = request.current_user
    created_by = user.id
    
    new_task = TaskModel(title=title, description=description, start=start, end=end, created_by=created_by)
    
    # Associate the task with the current user    
    user.tasks.append(new_task)
    
    # Assign the task to additional users
    for user_id in assigned_users:
        assigned_user = UserModel.get_first(id=user_id)
        if assigned_user:
            assigned_user.tasks.append(new_task)

    new_task.save()
    return jsonify(response_info(201, message='Successful', data=new_task.to_json()))


@task_views.route('/<task_id>', methods=['PUT'], strict_slashes=False)
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
        return jsonify(response_info(404, message="Error", error="Task not found"))
        
    # Define the fields we want to update
    fields_to_update = ['title', 'description', 'status', 'start', 'end']

    error = validate_json(*fields_to_update)
    if error:
        return error

    # Parse input data after validation
    data = request.get_json()
    
    for field in fields_to_update:
        if field in data:
            if field == 'status':
                status = data[field]
                if status not in TaskStatus._value2member_map_:
                    return jsonify(response_info(400, message='Error', error=f'Invalid status: {status}'))
                setattr(task, field, TaskStatus(status))
            else:
                setattr(task, field, data[field])
    
    # Update assigned users if 'assigned_users' field is present
    assigned_users = data.get('assigned_users', [])
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

    return jsonify(response_info(200, message='Successful', data=task.to_json()))


@task_views.route('/<task_id>', methods=['DELETE'], strict_slashes=False)
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
        return jsonify(response_info(404, message="Error", error="Task not found"))

    # Remove associated users from the task
    task.users.clear()
    task.save()

    # Delete the task itself
    task.delete()

    return jsonify(response_info(200, message='Successful'))


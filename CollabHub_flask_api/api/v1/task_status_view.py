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
from api.v1 import task_views
from api.response_utils import validate_json, response_info
from api.auth.auth_utils import authenticate, authorize


@task_views.route('/status/<status>', methods=['GET'], strict_slashes=False)
@authenticate
def get_tasks_by_status(status):
    # Retrieve the authenticated user from the request context
    user = request.current_user

    # Validate the status parameter
    if status not in TaskStatus.__members__:
        return jsonify(response_info(400, message=f'Invalid status: {status}'))

    # Fetch tasks for the authenticated user filtered by status
    filtered_tasks = TaskModel.get_tasks_for_user_by_status(user, TaskStatus[status.upper()])

    # Convert tasks to JSON format
    tasks_json = [task.to_json() for task in filtered_tasks]

    return jsonify(response_info(200, message=f'Tasks with status {status} fetched successfully', data=tasks_json))
#!/usr/bin/python3
"""
Task API endpoints.

This module defines API endpoints for managing tasks.

Endpoints:
    - GET /api/v1/tasks/<task_id>/attachments: Get all attachments for a specific task
    - POST /api/v1/tasks/<task_id>/attachments: Add a new attachment to a task
    - PUT /api/v1/tasks/<task_id>/attachments/<attachment_id>: Update an attachment of a task
    - DELETE /api/v1/tasks/<task_id>/attachments/<attachment_id>: Delete an attachment of a task
"""

from flask import jsonify, request
from models.tasks import TaskModel
from models.attachments import AttachmentModel
from api.v1 import task_views
from api.response_utils import validate_json, response_info
from api.auth.auth_utils import authenticate, authorize


@task_views.route('/<task_id>/attachments', methods=['GET'], strict_slashes=False)
@authenticate
def get_task_attachments(task_id):
    """
    Get all attachments for a specific task.

    Args:
        task_id (str): The ID of the task.

    Returns:
        JSON response containing all attachments for the task.
    """
    
    # Retrieve the authenticated user from the request context
    user = request.current_user

    # Fetch the task associated with the authenticated user
    task = TaskModel.get_first(id=task_id)
    if not task or user not in task.users:
        return jsonify(response_info(404, message='Error', error='Task not found'))

    # Fetch all attachments for the task
    attachments = AttachmentModel.query.filter_by(task_id=task_id).all()
    attachments_json = [attachment.to_json() for attachment in attachments]

    return jsonify(response_info(200, message='Successful', data=attachments_json))



@task_views.route('/<task_id>/attachments', methods=['POST'], strict_slashes=False)
@authenticate
def add_task_attachment(task_id):
    """
    Add a new attachment to a task.

    Args:
        task_id (str): The ID of the task.

    Returns:
        JSON response containing the new attachment.
    """
    
    error = validate_json('info')
    if error:
        return error
    
    # Retrieve the authenticated user from the request context
    user = request.current_user

    # Fetch the task associated with the authenticated user
    task = TaskModel.get_first(id=task_id)
    if not task or user not in task.users:
        return jsonify(response_info(404, message='Error', error='Task not found'))

    # Parse input data after validation.  Use None as default if field is not provided
    data = request.get_json()
    tag = data.get('tag', None)
    info = data.get('info')
    file = data.get('file', None)
    link = data.get('link', None)
    
    new_attachment = AttachmentModel(task_id=task.id, file=file, link=link, tag=tag, info=info)
    new_attachment.save()
    
    return jsonify(response_info(201, message='Successful', data=new_attachment.to_json()))


@task_views.route('/<task_id>/attachments/<attachment_id>', methods=['PUT'], strict_slashes=False)
@authenticate
def update_task_attachment(task_id, attachment_id):
    """
    Update an existing attachment of a task.

    Args:
        task_id (str): The ID of the task.
        attachment_id (str): The ID of the attachment to update.

    Returns:
        JSON response containing the updated attachment.
    """
    
    error = validate_json('info')
    if error:
        return error
    
    user = request.current_user

    task = TaskModel.get_first(id=task_id)
    if not task or user not in task.users:
        return jsonify(response_info(404, message='Error', error='Task not found'))

    attachment = AttachmentModel.get_first(id=attachment_id, task_id=task.id)
    if not attachment:
        return jsonify(response_info(404, message='Error', error='Attachment not found'))

    data = request.get_json()
    attachment.tag = data.get('tag', attachment.tag)
    attachment.info = data.get('info', attachment.info)
    attachment.file = data.get('file', attachment.file)
    attachment.link = data.get('link', attachment.link)
    attachment.save()
    
    return jsonify(response_info(200, message='Successful', data=attachment.to_json()))


@task_views.route('/<task_id>/attachments/<attachment_id>', methods=['DELETE'], strict_slashes=False)
@authenticate
def delete_task_attachment(task_id, attachment_id):
    """
    Delete an existing attachment of a task.

    Args:
        task_id (str): The ID of the task.
        attachment_id (str): The ID of the attachment to delete.

    Returns:
        JSON response confirming deletion.
    """
    
    user = request.current_user

    task = TaskModel.get_first(id=task_id)
    if not task or user not in task.users:
        return jsonify(response_info(404, message='Error', error='Task not found'))

    attachment = AttachmentModel.get_first(id=attachment_id, task_id=task.id)
    if not attachment:
        return jsonify(response_info(404, message='Error', error='Attachment not found'))

    attachment.delete()
    
    return jsonify(response_info(200, message='Successful', data='Attachment deleted'))
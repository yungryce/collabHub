#!/usr/bin/python
from flask import request
from datetime import datetime


# Define a standardized response structure
def response_info(status, message=None, data=None, error=None):
    """
    Create a standardized JSON response.

    Args:
        status (int): HTTP status code.
        message (str): Optional message providing additional information.
        data (dict): Optional data to include in the response.

    Returns:
        dict: Standardized JSON response.
    """
    response_data = {'status': status}
    if message:
        response_data['message'] = message
    if data:
        response_data['data'] = data
    if error:
        response_data['error'] = error
    return response_data


def validate_json(*required_fields):
    """
    Validate JSON input.

    Args:
        *required_fields (str): Required fields

    Returns:
        Error response if validation fails, None otherwise
    """
    if not request.is_json:
        return response_info(400, 'Not a JSON')

    data = request.get_json()
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return response_info(400, f'Missing fields: {", ".join(missing_fields)}')
    
    # Check if start and stop fields are present
    if 'start' in data:
        # Validate start field format as datetime
        if not is_valid_datetime(data['start']):
            return response_info(400, 'Invalid format for start field. Format should be YYYY-MM-DD HH:MM:SS')
    if 'stop' in data:
        # Validate stop field format as datetime
        if not is_valid_datetime(data['stop']):
            return response_info(400, 'Invalid format for stop field. Format should be YYYY-MM-DD HH:MM:SS')

    return None


def is_valid_datetime(date_str):
    """
    Check if a string represents a valid datetime.

    Args:
        date_str (str): String representing a datetime

    Returns:
        True if the string represents a valid datetime, False otherwise
    """
    try:
        datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
        return True
    except ValueError:
        return False
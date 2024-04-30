#!/usr/bin/python
from flask import request, jsonify

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
    return None


# Define a standardized response structure
def response_info(status, message=None, data=None):
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
    return response_data
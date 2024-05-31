#!/usr/bin/python3
"""
Recaptcha API endpoints.

This module defines API endpoints for handling recaptcha token.

Endpoints:
    - POST /api/v1/recaptcha/verify: post token and get recaptcha score
"""

from flask import jsonify, request
from api.response_utils import validate_json, response_info
from api.v1 import recaptcha_views 
from config.recaptcha import create_assessment
from flask import current_app


@recaptcha_views.route('/verify', methods=['POST'], strict_slashes=False)
def recaptcha_verify():
    """
    Get recaptcha score.

    Returns:
        JSON response containing all attachments for the task.
    """
    
    # Create reCAPTCHA assessment
    data = request.get_json()
    
    # Parse recaptcha variables
    recaptcha_token = data.get('token')
    recaptcha_action = data.get('action')
    recaptcha_site_key = current_app.config['RECAPTCHA_SITE_KEY']
    recaptcha_project_id = 'collabhub-v1'
    recaptcha_key_path = current_app.config['RECAPTCHA_KEY_PATH']
    
    # Create reCAPTCHA assessment
    assessment_response = create_assessment(recaptcha_project_id, recaptcha_site_key, recaptcha_token, recaptcha_action, recaptcha_key_path)
    
    # Check if the reCAPTCHA score is acceptable for registration
    if assessment_response and assessment_response.risk_analysis.score < 0.5:
        error_message = 'reCAPTCHA score too low. Registration denied.'
        return jsonify(response_info(403, message='Error', error=error_message))
    
    # Return the reCAPTCHA score if it's acceptable
    return jsonify(response_info(200, message='Successful' , data={'score': assessment_response.risk_analysis.score}))

#!/usr/bin/python3
import os
import logging
from flask import Flask, jsonify, request
from api.v1 import task_views, user_views
from api.auth.auth import auth_views
from database import db, init_db
from flask_migrate import Migrate
from factories.users import generateusers, deleteallusers
from factories.tasks import generatetasks, deletealltasks
from flask_cors import CORS

# Load environment variables from .env file
# from dotenv import load_dotenv
# load_dotenv()

# Determine the environment
env = os.getenv('FLASK_ENV', 'development')

# Start the Flask app
app = Flask(__name__)

# Load configuration based on the environment
if env == 'production':
    app.config.from_object('config.production.ProductionConfig')
else:
    app.config.from_object('config.development.DevelopmentConfig')

# Set up logging
log_format = '%(asctime)s - %(levelname)s - %(message)s'
logging.basicConfig(filename='app.log', level=app.config['LOG_LEVEL'], format=log_format)
app.logger.setLevel(app.config['LOG_LEVEL'])

# Log the current environment
app.logger.info('Logging set up for %s environment', env)

# Enable CORS for all routes
CORS(app)

# Initialize SQLAlchemy with the Flask app
init_db(app)
migrate = Migrate(app, db)

# Register the Blueprint with the Flask application
app.register_blueprint(task_views)
app.register_blueprint(auth_views)
app.register_blueprint(user_views)

app.cli.add_command(generateusers)
app.cli.add_command(deleteallusers)
app.cli.add_command(generatetasks)
app.cli.add_command(deletealltasks)

# Log request information before each request
@app.before_request
def log_request_info():
    app.logger.debug('Request: %s %s %s', request.method, request.url, request.data)

# Log response information after each request
@app.after_request
def log_response_info(response):
    app.logger.debug('Response: %s %s', response.status, response.get_data(as_text=True))
    return response

@app.errorhandler(404)
def not_found(error):
    """Error handler for 404 Not Found."""
    app.logger.error('Resource not found: %s', request.url)
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_server_error(error):
    """Error handler for 500 Internal Server Error."""
    app.logger.error('Internal server error: %s', error)
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(Exception)
def handle_unexpected_error(error):
    """General error handler."""
    status_code = 500
    if hasattr(error, 'code') and 500 <= error.code < 600:
        status_code = error.code
    response = jsonify({'error': 'An unexpected error occurred'})
    response.status_code = status_code
    app.logger.error('Internal server error: %s', error)
    return response

if __name__ == '__main__':
    host = os.getenv('HOST', '0.0.0.0')
    port = os.getenv('PORT', '5000')
    app.run(host=host, port=port, debug=(env == 'development'))
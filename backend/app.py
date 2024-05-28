#!/usr/bin/python3
import os
import logging

from flask import Flask, jsonify, request
from flask_mail import Mail
from flask_cors import CORS
from flask_migrate import Migrate

from config.database import db, init_db
from config.config import setup_logging
from config.mail_service import MailService
from config.error_handlers import register_error_handlers
from api.auth.auth import auth_views
from api.v1 import task_views, user_views

from factories.users import generateusers, deleteallusers
from factories.tasks import generatetasks, deletealltasks


# Start the Flask app
app = Flask(__name__)

# Load configuration based on the environment
env = os.getenv('FLASK_ENV', 'development')
if env == 'production':
    app.config.from_object('config.config.ProductionConfig')
else:
    app.config.from_object('config.config.DevelopmentConfig')

# Set up logging
setup_logging(app)

# Register error handlers
register_error_handlers(app)

# Initialize Flask-Mail and MailService
mail = Mail(app)
mail_service = MailService(mail)
app.mail_service = mail_service

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

if __name__ == '__main__':
    host = os.getenv('HOST', '0.0.0.0')
    port = os.getenv('PORT', '5000')
    app.run(host=host, port=port, debug=(env == 'development'))
#!/usr/bin/python3
import os
from flask import Flask, jsonify
from api.v1 import app_views
from api.auth.auth import auth_views
# from api.auth import auth_views
from database import db, init_db
from flask_migrate import Migrate
from factories.users import generateusers, deleteallusers

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Start the Flask app
app = Flask(__name__)

# Configure the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy with the Flask app
init_db(app)
migrate = Migrate(app, db)

# Register the Blueprint with the Flask application
app.register_blueprint(app_views)
app.register_blueprint(auth_views)

app.cli.add_command(generateusers)
app.cli.add_command(deleteallusers)

@app.errorhandler(404)
def not_found(error):
    """Error handler for 404 Not Found."""
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_server_error(error):
    """Error handler for 500 Internal Server Error."""
    return jsonify({'error': 'Internal server error'}), 500

# @app.errorhandler(Exception)
# def handle_unexpected_error(error):
#     """General error handler."""
#     response = jsonify({'error': 'An unexpected error occurred'})
#     response.status_code = 500 if not hasattr(error, 'code') else error.code
#     return response


if __name__ == '__main__':
    app.run(debug=True)
#!/usr/bin/python3
"""Initialize Blueprint views"""
from flask import Blueprint


task_views = Blueprint("app_views", __name__, url_prefix="/api/v1/tasks")
user_views = Blueprint("user_views", __name__, url_prefix="/api/v1/users")
recaptcha_views = Blueprint("recaptcha_views", __name__, url_prefix="/api/v1/recaptcha")

# Import and register Flask resources
from api.v1.recaptcha import *
from api.v1.task_view import *
from api.v1.user_view import *
from api.v1.task_attachment_view import *

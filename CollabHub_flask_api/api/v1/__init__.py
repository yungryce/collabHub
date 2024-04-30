#!/usr/bin/python3
"""Initialize Blueprint views"""
from flask import Blueprint


app_views = Blueprint("app_views", __name__, url_prefix="/api/v1/tasks")

# Import and register Flask resources
from api.v1.task_view import *

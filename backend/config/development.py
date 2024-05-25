import os, logging

class DevelopmentConfig:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    LOG_LEVEL = logging.DEBUG

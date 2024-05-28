# config/config.py
import os
import logging
from logging.handlers import RotatingFileHandler

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY')
    MAIL_SERVER = 'smtp.sendgrid.net'
    MAIL_SECRET_KEY=os.getenv('SENDGRID_API_KEY')
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'apikey'
    MAIL_PASSWORD = os.getenv('MAIL_SECRET_KEY')
    MAIL_DEFAULT_SENDER = 'admin@collabhub.me'
    MAIL_FROM_NAME='no-reply'
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'DEBUG')
    
class DevelopmentConfig(Config):
    DEBUG = True
    
class ProductionConfig(Config):
    DEBUG = False
    LOG_LEVEL = 'INFO'
    

def setup_logging(app):
    log_format = '%(asctime)s - %(levelname)s - %(message)s'
    log_filename = 'app.log'
    max_file_size = 10 * 1024 * 1024  # 10 MB
    backup_count = 5  # Keep up to 5 backup files

    file_handler = RotatingFileHandler(log_filename, maxBytes=max_file_size, backupCount=backup_count)
    file_handler.setFormatter(logging.Formatter(log_format))
    file_handler.setLevel(app.config['LOG_LEVEL'])
    
    # Clear existing handlers, if any
    if app.logger.hasHandlers():
        app.logger.handlers.clear()

    app.logger.addHandler(file_handler)
    app.logger.setLevel(app.config['LOG_LEVEL'])
    app.logger.propagate = False
#!/usr/bin/python3
# models/base_model.py

from datetime import datetime
from sqlalchemy import Column, DateTime, String
import uuid
from database import db

class BaseModel(db.Model):
    """Base model for other models."""

    __abstract__ = True  # Declares this as a base class for other models

    # Define columns
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def save(self):
        """
        Save the current instance to the database.

        Commits the changes to the database session.
        """
        try:
            db.session.add(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise Exception(e)

    def delete(self):
        """
        Delete the current instance from the database.

        Commits the changes to the database session.
        """
        try:
            db.session.delete(self)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise Exception(e)
    
    @classmethod
    def get_first(cls, **kwargs):
        """
        Get the first instance of the model that matches the given filter criteria.

        :param kwargs: Filter criteria
        :return: The first instance of the model matching the filter criteria, or None if not found
        """
        try:
            return db.session.query(cls).filter_by(**kwargs).first()
        except Exception as e:
            raise Exception(e)
        
    @classmethod
    def get_all(cls):
        """
        Get all instances of the model.

        :return: List of all instances of the model
        """
        try:
            return db.session.query(cls).all()
        except Exception as e:
            raise Exception(e)

#!/usr/bin/python3

from models.base_model import BaseModel
from sqlalchemy import Column, String
from datetime import datetime


class BlacklistToken(BaseModel):
    """
    Token Model for storing JWT tokens
    """
    __tablename__ = 'blacklist_tokens'

    token = Column(String(500), unique=True, nullable=False)

    def __init__(self, token):
        """
        Initialize a new blacklist token instance.

        :param token: Blacklisted token
        """
        self.token = token

    def __repr__(self):
        return '<id: token: {}'.format(self.token)

    @staticmethod
    def check_blacklist(token):
        """
        Check if a token is blacklisted.

        :param token: The token to check
        :return: True if the token is blacklisted, False otherwise
        """
        return BlacklistToken.query.filter_by(token=token).first() is not None
    
    # @staticmethod
    # def cleanup_expired_tokens():
    #     """
    #     Remove expired tokens from the blacklist.
    #     """
    #     try:
    #         expired_tokens = BlacklistToken.query.filter(BlacklistToken.expiry_date < datetime.utcnow()).all()
    #         for token in expired_tokens:
    #             session.delete(token)
    #         session.commit()
    #     except Exception as e:
    #         # Handle any exceptions
    #         pass
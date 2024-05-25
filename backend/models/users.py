#!/usr/bin/python3
# models/user.py

from .base_model import BaseModel
from sqlalchemy import Column, String
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from enum import Enum
from .tasks import task_user_association
import bcrypt


class UserRole(Enum):
    ADMIN = "admin"
    USER = "user"
    DEVELOPER = "developer"

    # Define the hierarchy
    HIERARCHY = {
        ADMIN: 3,
        DEVELOPER: 2,
        USER: 1
    }


    @staticmethod
    def compare_roles(role1, role2):
        """Compare two roles based on the hierarchy"""
        # Get the hierarchy dictionary from enum type
        hierarchy_dict = UserRole.__members__['HIERARCHY'].value
        return hierarchy_dict.get(role1.value, 0) - hierarchy_dict.get(role2.value, 0)



# def get_user_role(role: str) -> UserRole:
#     if role in UserRole._value2member_map_:
#         return UserRole(role)
#     else:
#         raise ValueError(f"{role} is not a valid UserRole")



# Define the User model
class UserModel(BaseModel):
    """Model for the users table."""
    __tablename__ = 'users'

    # Define columns
    email = Column(String(120), unique=True, nullable=False)
    username = Column(String(50), unique=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    _password = Column('password', String(128), nullable=False)
    role = Column(SQLAlchemyEnum(UserRole), default=UserRole.USER, nullable=False)
    
    # Define relationship with tasks
    tasks = relationship("TaskModel", 
                         secondary=task_user_association, 
                         back_populates="users",
                         cascade="save-update, merge, delete")

    def __init__(self, username=None, first_name=None, last_name=None, password=None, email=None, role=UserRole.USER):
        """
        Initialize a new User instance.

        :param username: The user's username
        :param first_name: The user's first name
        :param last_name: The user's last name
        :param password: The user's password
        :param email: The user's email address
        """
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        if password is not None:
            self.password = password
        # self.password = password
        self.email = email
        self.role = role


    def __repr__(self):
        """
        Return a string representation of the User instance.

        :return: String representation of the User instance
        """
        return f'<User {self.username!r}>'
    
    def to_json(self):
        """
        Serialize the User instance to a JSON-compatible dictionary.

        :return: Dictionary representation of the User instance
        """
        return {
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email
        }

    @property
    def password(self):
        """Getter method for the password."""
        raise AttributeError('password: write-only field')

    @password.setter
    def password(self, password):
        """Setter method for the password."""
        if password:
            self._password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self._password.encode('utf-8'))

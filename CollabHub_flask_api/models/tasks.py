#!/usr/bin/python3
# models/task.py
from enum import Enum
from .base_model import BaseModel
from sqlalchemy import Column, String, Table, ForeignKey, DateTime
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from database import db


class TaskStatus(Enum):
    START = "start"
    PAUSE = "pause"
    IN_PROGRESS = "in-progress"
    DONE = "done"
    CLOSE = "close"
    
# def get_task_status(status: str):
#     if status in TaskStatus._value2member_map_:
#         return TaskStatus(status)
#     else:
#         raise ValueError(f"{status} is not a valid TaskStatus")


task_user_association = Table('task_user_association', BaseModel.metadata,
    Column('task_id', String(36), ForeignKey('tasks.id')),
    Column('user_id', String(36), ForeignKey('users.id'))
)


class TaskModel(BaseModel):
    """Model for the tasks table."""
    __tablename__ = 'tasks'

    # Define columns
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    status = Column(SQLAlchemyEnum(TaskStatus), default=TaskStatus.PAUSE, nullable=False)
    created_by = Column(String(36), ForeignKey('users.id'))
    start = Column(DateTime, nullable=True)
    end = Column(DateTime, nullable=True)

    # Define relationship with users
    users = relationship("UserModel", 
                    secondary=task_user_association, 
                    back_populates="tasks",
                    cascade="save-update, merge, delete")

    def __init__(self, title=None, description=None, status=TaskStatus.PAUSE, created_by=None, start=None, end=None):
        """
        Initialize a new Task instance.

        :param title: The title of the task
        :param description: The description of the task
        :param status: The status of the task
        :param created_by: The ID of the user who created the task
        :param start: The start time of the task
        :param end: The end time of the task
        """
        self.title = title
        self.description = description
        self.status = status
        self.created_by = created_by
        self.start = start
        self.end = end

    def __repr__(self):
        """
        Return a string representation of the Task instance.

        :return: String representation of the Task instance
        """
        return f'<Task title={self.title!r}, description={self.description!r}, status={self.status!r}>'
    
    def to_json(self):
        """
        Serialize the Task model instance attributes to a dictionary

        :return: Dictionary representation of the Task instance
        """
        user_ids = [user.id for user in self.users]
        return {
            'id': self.id,
            'created_by': self.created_by,
            'user_ids': user_ids,
            'title': self.title,
            'description': self.description,
            'status': self.status.value, # 'start', 'pause', 'in-progress', 'done', 'close
            'start': self.start.isoformat() if self.start else None,
            'end': self.end.isoformat() if self.end else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
        
    @staticmethod
    def get_tasks_for_user_by_status(user, status):
        """
        Get tasks for a given user filtered by status.

        :param user: The user for whom to retrieve tasks
        :param status: The status of the tasks to retrieve
        :return: A list of tasks for the user with the specified status
        """
        return db.session.query(TaskModel).join(task_user_association).filter(
            task_user_association.c.user_id == user.id,
            TaskModel.status == status
        ).all()

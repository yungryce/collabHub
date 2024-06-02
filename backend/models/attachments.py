#!/usr/bin/python3
""" models/task-attachments.py"""
from .base_model import BaseModel
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from config.database import db


class AttachmentModel(BaseModel):
    """Model for the attachments table."""
    __tablename__ = 'task-attachments'

    task_id = Column(String(36), ForeignKey('tasks.id'), nullable=False)
    file = Column(String(255), nullable=True)
    link = Column(String(255), nullable=True)
    tag = Column(String(50), nullable=True)
    info = Column(String(255), nullable=True)

    def __init__(self, task_id=None, file=None, link=None, tag=None, info=None):
        """
        Initialize a new AttachmentModel instance.

        :param task_id: The ID of the task associated with the attachment
        :param file_path: The file path of the attachment
        :param link: The link of the attachment
        """
        self.task_id = task_id
        self.file = file
        self.link = link
        self.tag = tag
        self.info = info

    def __repr__(self):
        """Return a string representation of the AttachmentModel."""
        return f"<AttachmentModel(task_id='{self.task_id}', file_path='{self.file_path}', link='{self.link}')>"

    def to_json(self):
        """Return a JSON representation of the AttachmentModel."""
        return {
            "id": self.id,
            "task_id": self.task_id,
            "file": self.file,
            "link": self.link,
            "tag": self.tag,
            "info": self.info
        }
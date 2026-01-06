"""Notification service for sending notifications."""

from models.task import Task
from utils.logger import Logger

class NotificationService:
    """Service for sending notifications."""
    
    def __init__(self):
        self._logger = Logger.get_instance()
    
    def notify_task_created(self, task: Task) -> None:
        """Send notification when task is created."""
        self._logger.info(f"Sending notification: Task created - {task.title}")
        # In real app, would send email/push notification
    
    def notify_task_completed(self, task: Task) -> None:
        """Send notification when task is completed."""
        self._logger.info(f"Sending notification: Task completed - {task.title}")
    
    def notify_task_assigned(self, task: Task, assignee_id: int) -> None:
        """Send notification when task is assigned."""
        self._logger.info(f"Sending notification: Task assigned to user {assignee_id}")
    
    def notify_user_created(self, username: str, email: str) -> None:
        """Send notification when user is created."""
        self._logger.info(f"Sending notification: User created - {username}")

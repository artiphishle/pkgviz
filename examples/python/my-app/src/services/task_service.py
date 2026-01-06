"""Task service with business logic."""

from typing import List, Optional
from models.task import Task, TaskStatus
from database.task_repository import TaskRepository
from services.notification_service import NotificationService
from utils.logger import Logger
from utils.validator import Validator

class TaskService:
    """Service for task-related business logic."""
    
    def __init__(self):
        self._repository = TaskRepository()
        self._notification_service = NotificationService()
        self._logger = Logger.get_instance()
        self._validator = Validator()
    
    def get_task_by_id(self, task_id: int) -> Optional[Task]:
        """Get task by ID."""
        self._logger.info(f"Getting task: {task_id}")
        return self._repository.find_by_id(task_id)
    
    def get_tasks_by_project(self, project_id: int) -> List[Task]:
        """Get all tasks for a project."""
        self._logger.info(f"Getting tasks for project: {project_id}")
        return self._repository.find_by_project(project_id)
    
    def get_tasks_by_assignee(self, assignee_id: int) -> List[Task]:
        """Get all tasks assigned to a user."""
        self._logger.info(f"Getting tasks for assignee: {assignee_id}")
        return self._repository.find_by_assignee(assignee_id)
    
    def create_task(self, task: Task) -> Task:
        """Create a new task."""
        self._logger.info(f"Creating task: {task.title}")
        
        # Validate
        if not self._validator.is_not_empty(task.title):
            raise ValueError("Task title cannot be empty")
        
        saved_task = self._repository.save(task)
        
        # Send notification
        self._notification_service.notify_task_created(saved_task)
        
        return saved_task
    
    def complete_task(self, task_id: int) -> Task:
        """Mark task as completed."""
        self._logger.info(f"Completing task: {task_id}")
        
        task = self._repository.find_by_id(task_id)
        if not task:
            raise ValueError(f"Task not found: {task_id}")
        
        task.complete()
        updated_task = self._repository.update(task)
        
        # Send notification
        self._notification_service.notify_task_completed(updated_task)
        
        return updated_task
    
    def assign_task(self, task_id: int, assignee_id: int) -> Task:
        """Assign task to a user."""
        self._logger.info(f"Assigning task {task_id} to user {assignee_id}")
        
        task = self._repository.find_by_id(task_id)
        if not task:
            raise ValueError(f"Task not found: {task_id}")
        
        task.assignee_id = assignee_id
        updated_task = self._repository.update(task)
        
        # Send notification
        self._notification_service.notify_task_assigned(updated_task, assignee_id)
        
        return updated_task

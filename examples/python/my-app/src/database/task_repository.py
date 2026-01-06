"""Task repository for database operations."""

from typing import List, Optional
from models.task import Task, TaskStatus
from database.database_manager import DatabaseManager
from utils.logger import Logger

class TaskRepository:
    """Repository for Task entity database operations."""
    
    def __init__(self):
        self._db = DatabaseManager.get_instance()
        self._logger = Logger.get_instance()
    
    def find_by_id(self, task_id: int) -> Optional[Task]:
        """Find task by ID."""
        self._logger.debug(f"Finding task with ID: {task_id}")
        query = "SELECT * FROM tasks WHERE id = :id"
        result = self._db.execute_query(query, {"id": task_id})
        return None
    
    def find_by_project(self, project_id: int) -> List[Task]:
        """Find all tasks for a project."""
        self._logger.debug(f"Finding tasks for project: {project_id}")
        query = "SELECT * FROM tasks WHERE project_id = :project_id"
        result = self._db.execute_query(query, {"project_id": project_id})
        return []
    
    def find_by_assignee(self, assignee_id: int) -> List[Task]:
        """Find all tasks assigned to a user."""
        self._logger.debug(f"Finding tasks for assignee: {assignee_id}")
        query = "SELECT * FROM tasks WHERE assignee_id = :assignee_id"
        result = self._db.execute_query(query, {"assignee_id": assignee_id})
        return []
    
    def find_by_status(self, status: TaskStatus) -> List[Task]:
        """Find all tasks with a specific status."""
        self._logger.debug(f"Finding tasks with status: {status.value}")
        query = "SELECT * FROM tasks WHERE status = :status"
        result = self._db.execute_query(query, {"status": status.value})
        return []
    
    def save(self, task: Task) -> Task:
        """Save task to database."""
        self._logger.info(f"Saving task: {task.title}")
        query = "INSERT INTO tasks (...) VALUES (...)"
        result = self._db.execute_query(query)
        return task
    
    def update(self, task: Task) -> Task:
        """Update existing task."""
        self._logger.info(f"Updating task: {task.id}")
        query = "UPDATE tasks SET ... WHERE id = :id"
        result = self._db.execute_query(query, {"id": task.id})
        return task
    
    def delete(self, task_id: int) -> bool:
        """Delete task by ID."""
        self._logger.warning(f"Deleting task: {task_id}")
        query = "DELETE FROM tasks WHERE id = :id"
        result = self._db.execute_query(query, {"id": task_id})
        return True

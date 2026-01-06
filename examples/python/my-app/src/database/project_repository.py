"""Project repository for database operations."""

from typing import List, Optional
from models.project import Project
from database.database_manager import DatabaseManager
from utils.logger import Logger

class ProjectRepository:
    """Repository for Project entity database operations."""
    
    def __init__(self):
        self._db = DatabaseManager.get_instance()
        self._logger = Logger.get_instance()
    
    def find_by_id(self, project_id: int) -> Optional[Project]:
        """Find project by ID."""
        self._logger.debug(f"Finding project with ID: {project_id}")
        query = "SELECT * FROM projects WHERE id = :id"
        result = self._db.execute_query(query, {"id": project_id})
        return None
    
    def find_by_owner(self, owner_id: int) -> List[Project]:
        """Find all projects owned by a user."""
        self._logger.debug(f"Finding projects for owner: {owner_id}")
        query = "SELECT * FROM projects WHERE owner_id = :owner_id"
        result = self._db.execute_query(query, {"owner_id": owner_id})
        return []
    
    def find_active(self) -> List[Project]:
        """Find all active projects."""
        self._logger.debug("Finding active projects")
        query = "SELECT * FROM projects WHERE is_active = true"
        result = self._db.execute_query(query)
        return []
    
    def save(self, project: Project) -> Project:
        """Save project to database."""
        self._logger.info(f"Saving project: {project.name}")
        query = "INSERT INTO projects (...) VALUES (...)"
        result = self._db.execute_query(query)
        return project
    
    def update(self, project: Project) -> Project:
        """Update existing project."""
        self._logger.info(f"Updating project: {project.id}")
        query = "UPDATE projects SET ... WHERE id = :id"
        result = self._db.execute_query(query, {"id": project.id})
        return project

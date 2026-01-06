"""Project service with business logic."""

from typing import List, Optional
from models.project import Project
from database.project_repository import ProjectRepository
from utils.logger import Logger
from utils.validator import Validator

class ProjectService:
    """Service for project-related business logic."""
    
    def __init__(self):
        self._repository = ProjectRepository()
        self._logger = Logger.get_instance()
        self._validator = Validator()
    
    def get_project_by_id(self, project_id: int) -> Optional[Project]:
        """Get project by ID."""
        self._logger.info(f"Getting project: {project_id}")
        return self._repository.find_by_id(project_id)
    
    def get_projects_by_owner(self, owner_id: int) -> List[Project]:
        """Get all projects owned by a user."""
        self._logger.info(f"Getting projects for owner: {owner_id}")
        return self._repository.find_by_owner(owner_id)
    
    def get_active_projects(self) -> List[Project]:
        """Get all active projects."""
        self._logger.info("Getting active projects")
        return self._repository.find_active()
    
    def create_project(self, project: Project) -> Project:
        """Create a new project."""
        self._logger.info(f"Creating project: {project.name}")
        
        # Validate
        if not self._validator.is_not_empty(project.name):
            raise ValueError("Project name cannot be empty")
        
        return self._repository.save(project)
    
    def update_project(self, project: Project) -> Project:
        """Update existing project."""
        self._logger.info(f"Updating project: {project.id}")
        return self._repository.update(project)
    
    def archive_project(self, project_id: int) -> Project:
        """Archive a project."""
        self._logger.info(f"Archiving project: {project_id}")
        
        project = self._repository.find_by_id(project_id)
        if not project:
            raise ValueError(f"Project not found: {project_id}")
        
        project.archive()
        return self._repository.update(project)

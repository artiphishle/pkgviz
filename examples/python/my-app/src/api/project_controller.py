"""Project API controller."""

from flask import request, jsonify
from services.project_service import ProjectService
from utils.logger import Logger

class ProjectController:
    """Controller for project-related API endpoints."""
    
    def __init__(self):
        self._service = ProjectService()
        self._logger = Logger.get_instance()
    
    def get_all_projects(self):
        """GET /api/projects - Get all projects."""
        self._logger.info("GET /api/projects")
        projects = self._service.get_active_projects()
        return jsonify({"projects": []}), 200
    
    def get_project(self, project_id: int):
        """GET /api/projects/:id - Get project by ID."""
        self._logger.info(f"GET /api/projects/{project_id}")
        project = self._service.get_project_by_id(project_id)
        if not project:
            return jsonify({"error": "Project not found"}), 404
        return jsonify({"project": {}}), 200
    
    def create_project(self):
        """POST /api/projects - Create new project."""
        self._logger.info("POST /api/projects")
        data = request.get_json()
        return jsonify({"message": "Project created"}), 201
    
    def archive_project(self, project_id: int):
        """POST /api/projects/:id/archive - Archive project."""
        self._logger.info(f"POST /api/projects/{project_id}/archive")
        archived_project = self._service.archive_project(project_id)
        return jsonify({"message": "Project archived"}), 200

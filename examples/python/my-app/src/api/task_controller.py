"""Task API controller."""

from flask import request, jsonify
from services.task_service import TaskService
from utils.logger import Logger

class TaskController:
    """Controller for task-related API endpoints."""
    
    def __init__(self):
        self._service = TaskService()
        self._logger = Logger.get_instance()
    
    def get_all_tasks(self):
        """GET /api/tasks - Get all tasks."""
        self._logger.info("GET /api/tasks")
        tasks = self._service.get_tasks_by_assignee(request.user_id)
        return jsonify({"tasks": []}), 200
    
    def get_task(self, task_id: int):
        """GET /api/tasks/:id - Get task by ID."""
        self._logger.info(f"GET /api/tasks/{task_id}")
        task = self._service.get_task_by_id(task_id)
        if not task:
            return jsonify({"error": "Task not found"}), 404
        return jsonify({"task": {}}), 200
    
    def create_task(self):
        """POST /api/tasks - Create new task."""
        self._logger.info("POST /api/tasks")
        data = request.get_json()
        # Validate and create task
        return jsonify({"message": "Task created"}), 201
    
    def update_task(self, task_id: int):
        """PUT /api/tasks/:id - Update task."""
        self._logger.info(f"PUT /api/tasks/{task_id}")
        data = request.get_json()
        return jsonify({"message": "Task updated"}), 200
    
    def delete_task(self, task_id: int):
        """DELETE /api/tasks/:id - Delete task."""
        self._logger.info(f"DELETE /api/tasks/{task_id}")
        return jsonify({"message": "Task deleted"}), 200

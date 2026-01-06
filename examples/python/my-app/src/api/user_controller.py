"""User API controller."""

from flask import request, jsonify
from services.user_service import UserService
from utils.logger import Logger

class UserController:
    """Controller for user-related API endpoints."""
    
    def __init__(self):
        self._service = UserService()
        self._logger = Logger.get_instance()
    
    def get_all_users(self):
        """GET /api/users - Get all users."""
        self._logger.info("GET /api/users")
        users = self._service.get_all_users()
        return jsonify({"users": []}), 200
    
    def get_user(self, user_id: int):
        """GET /api/users/:id - Get user by ID."""
        self._logger.info(f"GET /api/users/{user_id}")
        user = self._service.get_user_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"user": {}}), 200
    
    def create_user(self):
        """POST /api/users - Create new user."""
        self._logger.info("POST /api/users")
        data = request.get_json()
        return jsonify({"message": "User created"}), 201
    
    def update_user(self, user_id: int):
        """PUT /api/users/:id - Update user."""
        self._logger.info(f"PUT /api/users/{user_id}")
        data = request.get_json()
        return jsonify({"message": "User updated"}), 200

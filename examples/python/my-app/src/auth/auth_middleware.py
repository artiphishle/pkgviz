"""Authentication middleware for Flask."""

from flask import request, jsonify
from typing import Optional
from auth.session_manager import SessionManager
from utils.logger import Logger

class AuthMiddleware:
    """Middleware for authenticating requests."""
    
    def __init__(self):
        self._session_manager = SessionManager()
        self._logger = Logger.get_instance()
    
    def authenticate(self) -> Optional[any]:
        """Authenticate incoming request."""
        # Skip auth for public endpoints
        if request.path in ["/api/auth/login", "/api/auth/register"]:
            return None
        
        # Get token from header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            self._logger.warning("Missing or invalid authorization header")
            return jsonify({"error": "Unauthorized"}), 401
        
        token = auth_header.split(" ")[1]
        
        # Validate token
        user_id = self._session_manager.get_user_id(token)
        if not user_id:
            self._logger.warning("Invalid session token")
            return jsonify({"error": "Invalid session"}), 401
        
        # Store user_id in request context
        request.user_id = user_id
        return None

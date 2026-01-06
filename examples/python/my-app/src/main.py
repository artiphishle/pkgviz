"""
Main entry point for the task management application.
"""

from flask import Flask
from utils.logger import Logger
from database.database_manager import DatabaseManager
from api.task_controller import TaskController
from api.user_controller import UserController
from api.project_controller import ProjectController
from auth.auth_middleware import AuthMiddleware

# Initialize logger
logger = Logger.get_instance()

def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "dev-secret-key"
    
    # Initialize database
    db_manager = DatabaseManager.get_instance()
    db_manager.initialize()
    
    # Register controllers
    task_controller = TaskController()
    user_controller = UserController()
    project_controller = ProjectController()
    
    # Register routes
    app.add_url_rule("/api/tasks", view_func=task_controller.get_all_tasks, methods=["GET"])
    app.add_url_rule("/api/tasks/<int:task_id>", view_func=task_controller.get_task, methods=["GET"])
    app.add_url_rule("/api/tasks", view_func=task_controller.create_task, methods=["POST"])
    
    app.add_url_rule("/api/users", view_func=user_controller.get_all_users, methods=["GET"])
    app.add_url_rule("/api/users/<int:user_id>", view_func=user_controller.get_user, methods=["GET"])
    
    app.add_url_rule("/api/projects", view_func=project_controller.get_all_projects, methods=["GET"])
    app.add_url_rule("/api/projects/<int:project_id>", view_func=project_controller.get_project, methods=["GET"])
    
    # Apply middleware
    auth_middleware = AuthMiddleware()
    app.before_request(auth_middleware.authenticate)
    
    logger.info("Application initialized successfully")
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)

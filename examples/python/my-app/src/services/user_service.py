"""User service with business logic."""

from typing import List, Optional
from models.user import User
from database.user_repository import UserRepository
from utils.validator import Validator
from utils.logger import Logger
from auth.password_hasher import PasswordHasher

class UserService:
    """Service for user-related business logic."""
    
    def __init__(self):
        self._repository = UserRepository()
        self._validator = Validator()
        self._logger = Logger.get_instance()
        self._password_hasher = PasswordHasher()
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        self._logger.info(f"Getting user: {user_id}")
        return self._repository.find_by_id(user_id)
    
    def get_all_users(self) -> List[User]:
        """Get all users."""
        self._logger.info("Getting all users")
        return self._repository.find_all()
    
    def create_user(self, username: str, email: str, password: str, full_name: str) -> User:
        """Create a new user."""
        self._logger.info(f"Creating user: {username}")
        
        # Validate input
        if not self._validator.is_valid_email(email):
            raise ValueError("Invalid email address")
        
        if not self._validator.is_valid_password(password):
            raise ValueError("Password does not meet requirements")
        
        # Hash password
        password_hash = self._password_hasher.hash_password(password)
        
        # Create user (mock)
        from datetime import datetime
        user = User(
            id=0,
            username=username,
            email=email,
            password_hash=password_hash,
            full_name=full_name,
            created_at=datetime.now()
        )
        
        return self._repository.save(user)
    
    def update_user(self, user: User) -> User:
        """Update existing user."""
        self._logger.info(f"Updating user: {user.id}")
        return self._repository.update(user)
    
    def delete_user(self, user_id: int) -> bool:
        """Delete a user."""
        self._logger.warning(f"Deleting user: {user_id}")
        return self._repository.delete(user_id)

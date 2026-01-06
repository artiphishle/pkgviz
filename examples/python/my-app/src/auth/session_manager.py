"""Session management for authenticated users."""

from typing import Optional, Dict
from datetime import datetime, timedelta
from utils.logger import Logger

class SessionManager:
    """Manages user sessions."""
    
    def __init__(self):
        self._sessions: Dict[str, Dict] = {}
        self._logger = Logger.get_instance()
    
    def create_session(self, user_id: int, token: str) -> None:
        """Create a new session for a user."""
        self._logger.info(f"Creating session for user: {user_id}")
        self._sessions[token] = {
            "user_id": user_id,
            "created_at": datetime.now(),
            "expires_at": datetime.now() + timedelta(hours=24),
        }
    
    def get_user_id(self, token: str) -> Optional[int]:
        """Get user ID from session token."""
        session = self._sessions.get(token)
        if not session:
            return None
        
        # Check expiration
        if datetime.now() > session["expires_at"]:
            self.destroy_session(token)
            return None
        
        return session["user_id"]
    
    def destroy_session(self, token: str) -> None:
        """Destroy a session."""
        self._logger.info(f"Destroying session: {token[:10]}...")
        if token in self._sessions:
            del self._sessions[token]
    
    def is_valid(self, token: str) -> bool:
        """Check if a session token is valid."""
        return self.get_user_id(token) is not None

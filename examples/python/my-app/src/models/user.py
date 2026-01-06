"""User model."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class User:
    """User entity."""
    
    id: int
    username: str
    email: str
    password_hash: str
    full_name: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_active: bool = True
    
    def __post_init__(self):
        """Validate user data after initialization."""
        if not self.username or len(self.username) < 3:
            raise ValueError("Username must be at least 3 characters")
        if not self.email or "@" not in self.email:
            raise ValueError("Invalid email address")
    
    def get_display_name(self) -> str:
        """Get the display name for the user."""
        return self.full_name if self.full_name else self.username
    
    def deactivate(self) -> None:
        """Deactivate the user account."""
        self.is_active = False
        self.updated_at = datetime.now()
    
    def activate(self) -> None:
        """Activate the user account."""
        self.is_active = True
        self.updated_at = datetime.now()

"""Project model."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional, List

@dataclass
class Project:
    """Project entity."""
    
    id: int
    name: str
    description: str
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: bool = True
    
    def __post_init__(self):
        """Validate project data."""
        if not self.name or len(self.name) < 3:
            raise ValueError("Project name must be at least 3 characters")
    
    def archive(self) -> None:
        """Archive the project."""
        self.is_active = False
        self.updated_at = datetime.now()
    
    def unarchive(self) -> None:
        """Unarchive the project."""
        self.is_active = True
        self.updated_at = datetime.now()
    
    def is_completed(self) -> bool:
        """Check if project end date has passed."""
        if not self.end_date:
            return False
        return datetime.now() > self.end_date

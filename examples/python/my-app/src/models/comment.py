"""Comment model."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Comment:
    """Comment entity for tasks."""
    
    id: int
    task_id: int
    author_id: int
    content: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_edited: bool = False
    
    def edit(self, new_content: str) -> None:
        """Edit the comment content."""
        self.content = new_content
        self.is_edited = True
        self.updated_at = datetime.now()
    
    def get_preview(self, max_length: int = 100) -> str:
        """Get a preview of the comment."""
        if len(self.content) <= max_length:
            return self.content
        return self.content[:max_length] + "..."

"""Task model."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from enum import Enum

class TaskStatus(Enum):
    """Task status enumeration."""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"
    CANCELLED = "cancelled"

class TaskPriority(Enum):
    """Task priority enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

@dataclass
class Task:
    """Task entity."""
    
    id: int
    title: str
    description: str
    status: TaskStatus
    priority: TaskPriority
    assignee_id: int
    project_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    def is_overdue(self) -> bool:
        """Check if task is overdue."""
        if not self.due_date:
            return False
        return self.status != TaskStatus.DONE and datetime.now() > self.due_date
    
    def complete(self) -> None:
        """Mark task as completed."""
        self.status = TaskStatus.DONE
        self.completed_at = datetime.now()
        self.updated_at = datetime.now()
    
    def start(self) -> None:
        """Start working on task."""
        self.status = TaskStatus.IN_PROGRESS
        self.updated_at = datetime.now()
    
    def cancel(self) -> None:
        """Cancel the task."""
        self.status = TaskStatus.CANCELLED
        self.updated_at = datetime.now()

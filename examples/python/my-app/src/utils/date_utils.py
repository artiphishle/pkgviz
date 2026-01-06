"""Date and time utility functions."""

from datetime import datetime, timedelta
from typing import Optional

def format_date(date: datetime, format_str: str = "%Y-%m-%d") -> str:
    """Format a datetime object as a string."""
    return date.strftime(format_str)

def parse_date(date_str: str, format_str: str = "%Y-%m-%d") -> Optional[datetime]:
    """Parse a string into a datetime object."""
    try:
        return datetime.strptime(date_str, format_str)
    except ValueError:
        return None

def is_past(date: datetime) -> bool:
    """Check if a date is in the past."""
    return date < datetime.now()

def is_future(date: datetime) -> bool:
    """Check if a date is in the future."""
    return date > datetime.now()

def add_days(date: datetime, days: int) -> datetime:
    """Add days to a date."""
    return date + timedelta(days=days)

def days_between(start: datetime, end: datetime) -> int:
    """Calculate days between two dates."""
    return (end - start).days

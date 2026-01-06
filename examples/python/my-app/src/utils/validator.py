"""Input validation utilities."""

import re
from typing import Optional

class Validator:
    """Validation utility class."""
    
    @staticmethod
    def is_valid_email(email: str) -> bool:
        """Validate email format."""
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        return bool(re.match(pattern, email))
    
    @staticmethod
    def is_valid_password(password: str) -> bool:
        """Validate password strength (min 8 chars, 1 upper, 1 lower, 1 digit)."""
        if len(password) < 8:
            return False
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        return has_upper and has_lower and has_digit
    
    @staticmethod
    def is_not_empty(text: Optional[str]) -> bool:
        """Check if text is not empty."""
        return text is not None and len(text.strip()) > 0
    
    @staticmethod
    def is_in_range(value: int, min_val: int, max_val: int) -> bool:
        """Check if value is in range."""
        return min_val <= value <= max_val

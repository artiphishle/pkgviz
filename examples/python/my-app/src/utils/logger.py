"""Logging utility with singleton pattern."""

import logging
from datetime import datetime
from typing import Optional

class Logger:
    """Singleton logger for application-wide logging."""
    
    _instance: Optional["Logger"] = None
    _logger: Optional[logging.Logger] = None
    
    def __init__(self):
        if Logger._instance is not None:
            raise Exception("Logger is a singleton. Use get_instance()")
        
        self._logger = logging.getLogger("TaskApp")
        self._logger.setLevel(logging.INFO)
        
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        # Formatter
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        console_handler.setFormatter(formatter)
        
        self._logger.addHandler(console_handler)
    
    @staticmethod
    def get_instance() -> "Logger":
        """Get the singleton instance of Logger."""
        if Logger._instance is None:
            Logger._instance = Logger()
        return Logger._instance
    
    def info(self, message: str) -> None:
        """Log info message."""
        self._logger.info(message)
    
    def error(self, message: str) -> None:
        """Log error message."""
        self._logger.error(message)
    
    def warning(self, message: str) -> None:
        """Log warning message."""
        self._logger.warning(message)
    
    def debug(self, message: str) -> None:
        """Log debug message."""
        self._logger.debug(message)

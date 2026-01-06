"""Password hashing utility using bcrypt."""

import bcrypt

class PasswordHasher:
    """Utility for hashing and verifying passwords."""
    
    def __init__(self, rounds: int = 12):
        self._rounds = rounds
    
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt."""
        salt = bcrypt.gensalt(rounds=self._rounds)
        hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
        return hashed.decode("utf-8")
    
    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify a password against a hash."""
        return bcrypt.checkpw(
            password.encode("utf-8"),
            hashed.encode("utf-8")
        )

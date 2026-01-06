"""String utility functions."""

import re
from typing import Optional

def to_snake_case(text: str) -> str:
    """Convert text to snake_case."""
    text = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1_\2", text)
    text = re.sub(r"([a-z\d])([A-Z])", r"\1_\2", text)
    text = text.replace("-", "_")
    return text.lower()

def to_camel_case(text: str) -> str:
    """Convert text to camelCase."""
    components = text.split("_")
    return components[0] + "".join(x.title() for x in components[1:])

def truncate(text: str, max_length: int, suffix: str = "...") -> str:
    """Truncate text to max_length with suffix."""
    if len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)] + suffix

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[-\s]+", "-", text)
    return text.strip("-")

# Task Management Application

A comprehensive Python task management application demonstrating various architectural patterns and best practices.

## Features

- User management with authentication
- Task tracking with status and priority
- Project organization
- Comment system for tasks
- RESTful API with Flask
- Repository pattern for data access
- Service layer for business logic
- Singleton patterns for shared resources

## Architecture

The application follows a layered architecture:

- **Models**: Data entities (User, Task, Project, Comment)
- **Database**: Repository pattern for data access
- **Services**: Business logic layer
- **API**: RESTful controllers
- **Auth**: Authentication and authorization
- **Utils**: Shared utilities (Logger, Validator, StringUtils, DateUtils)

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run the application
python src/main.py
```

## Project Structure

```
src/
├── main.py                 # Application entry point
├── models/                 # Data models
├── database/              # Repositories and database manager
├── services/              # Business logic
├── api/                   # API controllers
├── auth/                  # Authentication
└── utils/                 # Utilities
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `GET /api/users` - Get all users
- `GET /api/projects` - Get all projects

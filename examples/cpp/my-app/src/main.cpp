#include <iostream>
#include <memory>
#include "utils/Logger.h"
#include "database/Database.h"
#include "auth/AuthManager.h"
#include "services/UserService.h"
#include "services/TaskService.h"
#include "services/ProjectService.h"
#include "api/UserController.h"
#include "api/TaskController.h"
#include "api/ProjectController.h"

int main() {
    utils::Logger::getInstance().info("Starting Task Manager Application");
    
    // Initialize database
    database::Database& db = database::Database::getInstance();
    db.connect("taskmanager.db");
    
    // Initialize authentication
    auth::AuthManager authManager;
    
    // Initialize services
    services::UserService userService;
    services::ProjectService projectService;
    services::TaskService taskService;
    
    // Initialize API controllers
    api::UserController userController(userService, authManager);
    api::ProjectController projectController(projectService, authManager);
    api::TaskController taskController(taskService, authManager);
    
    // Simulate user workflow
    utils::Logger::getInstance().info("Creating new user...");
    userController.registerUser("john@example.com", "password123", "John Doe");
    
    auto session = authManager.login("john@example.com", "password123");
    if (session) {
        utils::Logger::getInstance().info("User logged in successfully");
        
        // Create project
        projectController.createProject("Website Redesign", "Redesign company website");
        
        // Create tasks
        taskController.createTask("Design mockups", "Create UI mockups for new website", 1);
        taskController.createTask("Implement frontend", "Build React components", 1);
        taskController.createTask("Backend API", "Create REST API endpoints", 1);
        
        // List all tasks
        taskController.listTasks();
    }
    
    db.disconnect();
    utils::Logger::getInstance().info("Application shutdown complete");
    
    return 0;
}

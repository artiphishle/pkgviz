package com.example

import com.example.controllers.TaskController
import com.example.controllers.UserController
import com.example.controllers.ProjectController
import com.example.database.Database
import com.example.utils.Logger

fun main() {
    Logger.info("Starting Task Management Application")
    
    // Initialize database
    Database.connect()
    
    // Initialize controllers
    val userController = UserController()
    val taskController = TaskController()
    val projectController = ProjectController()
    
    // Example usage
    val user = userController.createUser("john@example.com", "John Doe")
    Logger.info("Created user: ${user.name}")
    
    val project = projectController.createProject("Website Redesign", "Redesign company website", user.id)
    Logger.info("Created project: ${project.name}")
    
    val task = taskController.createTask("Design homepage", "Create modern homepage design", project.id, user.id)
    Logger.info("Created task: ${task.title}")
    
    // Display all tasks for user
    val userTasks = taskController.getTasksByUser(user.id)
    Logger.info("User has ${userTasks.size} tasks")
    
    Logger.info("Application completed successfully")
}

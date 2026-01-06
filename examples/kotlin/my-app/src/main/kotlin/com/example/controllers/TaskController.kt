package com.example.controllers

import com.example.models.Task
import com.example.models.TaskStatus
import com.example.models.TaskPriority
import com.example.services.TaskService
import java.time.LocalDateTime

class TaskController {
    private val taskService = TaskService()
    
    fun createTask(
        title: String,
        description: String,
        projectId: String,
        assigneeId: String?,
        priority: TaskPriority = TaskPriority.MEDIUM,
        dueDate: LocalDateTime? = null
    ): Task {
        return taskService.createTask(title, description, projectId, assigneeId, priority, dueDate)
    }
    
    fun getTask(id: String): Task? {
        return taskService.getTaskById(id)
    }
    
    fun getTasksByProject(projectId: String): List<Task> {
        return taskService.getTasksByProject(projectId)
    }
    
    fun getTasksByUser(userId: String): List<Task> {
        return taskService.getTasksByUser(userId)
    }
    
    fun updateTaskStatus(id: String, status: TaskStatus): Task? {
        return taskService.updateTaskStatus(id, status)
    }
    
    fun assignTask(taskId: String, userId: String): Task? {
        return taskService.assignTask(taskId, userId)
    }
    
    fun deleteTask(id: String): Boolean {
        return taskService.deleteTask(id)
    }
}

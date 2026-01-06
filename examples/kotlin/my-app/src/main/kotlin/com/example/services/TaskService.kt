package com.example.services

import com.example.models.Task
import com.example.models.TaskStatus
import com.example.models.TaskPriority
import com.example.repositories.TaskRepository
import com.example.utils.Logger
import java.time.LocalDateTime
import java.util.UUID

class TaskService {
    private val taskRepository = TaskRepository()
    
    fun createTask(
        title: String,
        description: String,
        projectId: String,
        assigneeId: String?,
        priority: TaskPriority = TaskPriority.MEDIUM,
        dueDate: LocalDateTime? = null
    ): Task {
        Logger.info("Creating task: $title")
        
        val task = Task(
            id = UUID.randomUUID().toString(),
            title = title,
            description = description,
            projectId = projectId,
            assigneeId = assigneeId,
            priority = priority,
            dueDate = dueDate,
            status = TaskStatus.TODO
        )
        
        taskRepository.save(task)
        return task
    }
    
    fun getTaskById(id: String): Task? {
        return taskRepository.findById(id)
    }
    
    fun getTasksByProject(projectId: String): List<Task> {
        return taskRepository.findByProject(projectId)
    }
    
    fun getTasksByUser(userId: String): List<Task> {
        return taskRepository.findByAssignee(userId)
    }
    
    fun updateTaskStatus(id: String, status: TaskStatus): Task? {
        val task = taskRepository.findById(id) ?: return null
        val updatedTask = task.copy(status = status, updatedAt = LocalDateTime.now())
        taskRepository.update(updatedTask)
        return updatedTask
    }
    
    fun assignTask(taskId: String, userId: String): Task? {
        val task = taskRepository.findById(taskId) ?: return null
        val updatedTask = task.copy(assigneeId = userId, updatedAt = LocalDateTime.now())
        taskRepository.update(updatedTask)
        return updatedTask
    }
    
    fun deleteTask(id: String): Boolean {
        return taskRepository.delete(id)
    }
}

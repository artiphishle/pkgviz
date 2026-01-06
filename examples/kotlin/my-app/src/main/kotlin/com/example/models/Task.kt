package com.example.models

import java.time.LocalDateTime

enum class TaskStatus {
    TODO, IN_PROGRESS, DONE, CANCELLED
}

enum class TaskPriority {
    LOW, MEDIUM, HIGH, URGENT
}

data class Task(
    val id: String,
    val title: String,
    val description: String,
    val projectId: String,
    val assigneeId: String?,
    val status: TaskStatus = TaskStatus.TODO,
    val priority: TaskPriority = TaskPriority.MEDIUM,
    val dueDate: LocalDateTime?,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
) {
    fun isOverdue(): Boolean {
        return dueDate?.isBefore(LocalDateTime.now()) ?: false
    }
    
    fun isDone(): Boolean {
        return status == TaskStatus.DONE
    }
    
    fun getStatusLabel(): String {
        return when (status) {
            TaskStatus.TODO -> "To Do"
            TaskStatus.IN_PROGRESS -> "In Progress"
            TaskStatus.DONE -> "Done"
            TaskStatus.CANCELLED -> "Cancelled"
        }
    }
}

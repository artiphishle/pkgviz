package com.example.repositories

import com.example.models.Task
import com.example.database.Database

class TaskRepository {
    private val db = Database
    
    fun save(task: Task) {
        db.execute("INSERT INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            task.id, task.title, task.description, task.projectId, task.assigneeId,
            task.status, task.priority, task.dueDate, task.createdAt, task.updatedAt)
    }
    
    fun findById(id: String): Task? {
        return db.query("SELECT * FROM tasks WHERE id = ?", id)
    }
    
    fun findByProject(projectId: String): List<Task> {
        return db.queryAll("SELECT * FROM tasks WHERE project_id = ?", projectId)
    }
    
    fun findByAssignee(assigneeId: String): List<Task> {
        return db.queryAll("SELECT * FROM tasks WHERE assignee_id = ?", assigneeId)
    }
    
    fun update(task: Task) {
        db.execute("UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, updated_at = ? WHERE id = ?",
            task.title, task.description, task.status, task.priority, task.updatedAt, task.id)
    }
    
    fun delete(id: String): Boolean {
        return db.execute("DELETE FROM tasks WHERE id = ?", id) > 0
    }
}

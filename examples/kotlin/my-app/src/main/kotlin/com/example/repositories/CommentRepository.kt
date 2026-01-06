package com.example.repositories

import com.example.models.Comment
import com.example.database.Database

class CommentRepository {
    private val db = Database
    
    fun save(comment: Comment) {
        db.execute("INSERT INTO comments VALUES (?, ?, ?, ?, ?, ?)",
            comment.id, comment.taskId, comment.userId, comment.content,
            comment.createdAt, comment.updatedAt)
    }
    
    fun findById(id: String): Comment? {
        return db.query("SELECT * FROM comments WHERE id = ?", id)
    }
    
    fun findByTask(taskId: String): List<Comment> {
        return db.queryAll("SELECT * FROM comments WHERE task_id = ?", taskId)
    }
    
    fun update(comment: Comment) {
        db.execute("UPDATE comments SET content = ?, updated_at = ? WHERE id = ?",
            comment.content, comment.updatedAt, comment.id)
    }
    
    fun delete(id: String): Boolean {
        return db.execute("DELETE FROM comments WHERE id = ?", id) > 0
    }
}

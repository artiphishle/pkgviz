package com.example.services

import com.example.models.Comment
import com.example.repositories.CommentRepository
import com.example.utils.Logger
import java.time.LocalDateTime
import java.util.UUID

class CommentService {
    private val commentRepository = CommentRepository()
    
    fun createComment(taskId: String, userId: String, content: String): Comment {
        Logger.info("Creating comment on task: $taskId")
        
        val comment = Comment(
            id = UUID.randomUUID().toString(),
            taskId = taskId,
            userId = userId,
            content = content
        )
        
        commentRepository.save(comment)
        return comment
    }
    
    fun getCommentById(id: String): Comment? {
        return commentRepository.findById(id)
    }
    
    fun getCommentsByTask(taskId: String): List<Comment> {
        return commentRepository.findByTask(taskId)
    }
    
    fun updateComment(id: String, content: String): Comment? {
        val comment = commentRepository.findById(id) ?: return null
        val updatedComment = comment.copy(content = content, updatedAt = LocalDateTime.now())
        commentRepository.update(updatedComment)
        return updatedComment
    }
    
    fun deleteComment(id: String): Boolean {
        return commentRepository.delete(id)
    }
}

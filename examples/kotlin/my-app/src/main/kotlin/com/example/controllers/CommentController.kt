package com.example.controllers

import com.example.models.Comment
import com.example.services.CommentService

class CommentController {
    private val commentService = CommentService()
    
    fun createComment(taskId: String, userId: String, content: String): Comment {
        return commentService.createComment(taskId, userId, content)
    }
    
    fun getComment(id: String): Comment? {
        return commentService.getCommentById(id)
    }
    
    fun getCommentsByTask(taskId: String): List<Comment> {
        return commentService.getCommentsByTask(taskId)
    }
    
    fun updateComment(id: String, content: String): Comment? {
        return commentService.updateComment(id, content)
    }
    
    fun deleteComment(id: String): Boolean {
        return commentService.deleteComment(id)
    }
}

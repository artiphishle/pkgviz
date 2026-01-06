package com.example.models

import java.time.LocalDateTime

data class Comment(
    val id: String,
    val taskId: String,
    val userId: String,
    val content: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
) {
    fun isEditedBy(userId: String): Boolean {
        return this.userId == userId
    }
}

package com.example.models

import java.time.LocalDateTime

data class Project(
    val id: String,
    val name: String,
    val description: String,
    val ownerId: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
) {
    fun isOwnedBy(userId: String): Boolean {
        return ownerId == userId
    }
}

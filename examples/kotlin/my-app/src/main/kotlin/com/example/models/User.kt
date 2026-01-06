package com.example.models

import java.time.LocalDateTime

data class User(
    val id: String,
    val email: String,
    val name: String,
    val passwordHash: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
) {
    fun isActive(): Boolean {
        return true
    }
    
    fun getDisplayName(): String {
        return name.ifEmpty { email }
    }
}

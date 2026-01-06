package com.example.services

import com.example.models.User
import com.example.repositories.UserRepository
import com.example.utils.Logger
import com.example.utils.ValidationUtils
import java.time.LocalDateTime
import java.util.UUID

class UserService {
    private val userRepository = UserRepository()
    
    fun createUser(email: String, name: String, password: String): User {
        Logger.info("Creating user: $email")
        
        if (!ValidationUtils.isValidEmail(email)) {
            throw IllegalArgumentException("Invalid email format")
        }
        
        if (password.length < 8) {
            throw IllegalArgumentException("Password must be at least 8 characters")
        }
        
        val passwordHash = hashPassword(password)
        
        val user = User(
            id = UUID.randomUUID().toString(),
            email = email,
            name = name,
            passwordHash = passwordHash
        )
        
        userRepository.save(user)
        return user
    }
    
    fun getUserById(id: String): User? {
        return userRepository.findById(id)
    }
    
    fun getUserByEmail(email: String): User? {
        return userRepository.findByEmail(email)
    }
    
    fun updateUser(id: String, name: String): User? {
        val user = userRepository.findById(id) ?: return null
        val updatedUser = user.copy(name = name, updatedAt = LocalDateTime.now())
        userRepository.update(updatedUser)
        return updatedUser
    }
    
    fun deleteUser(id: String): Boolean {
        return userRepository.delete(id)
    }
    
    private fun hashPassword(password: String): String {
        // In production, use a proper hashing library like BCrypt
        return password.hashCode().toString()
    }
}

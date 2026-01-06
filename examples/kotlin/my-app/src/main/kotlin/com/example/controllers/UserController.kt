package com.example.controllers

import com.example.models.User
import com.example.services.UserService

class UserController {
    private val userService = UserService()
    
    fun createUser(email: String, name: String, password: String = "password123"): User {
        return userService.createUser(email, name, password)
    }
    
    fun getUser(id: String): User? {
        return userService.getUserById(id)
    }
    
    fun updateUser(id: String, name: String): User? {
        return userService.updateUser(id, name)
    }
    
    fun deleteUser(id: String): Boolean {
        return userService.deleteUser(id)
    }
}

package com.example.utils

object ValidationUtils {
    fun isValidEmail(email: String): Boolean {
        val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$".toRegex()
        return emailRegex.matches(email)
    }
    
    fun isValidPassword(password: String): Boolean {
        return password.length >= 8
    }
    
    fun isNotEmpty(value: String): Boolean {
        return value.trim().isNotEmpty()
    }
}

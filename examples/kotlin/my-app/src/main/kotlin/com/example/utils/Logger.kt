package com.example.utils

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

object Logger {
    private val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
    
    fun info(message: String) {
        log("INFO", message)
    }
    
    fun debug(message: String) {
        log("DEBUG", message)
    }
    
    fun warn(message: String) {
        log("WARN", message)
    }
    
    fun error(message: String) {
        log("ERROR", message)
    }
    
    private fun log(level: String, message: String) {
        val timestamp = LocalDateTime.now().format(formatter)
        println("[$timestamp] [$level] $message")
    }
}

package com.example.utils

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

object DateUtils {
    private val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
    
    fun formatDateTime(dateTime: LocalDateTime): String {
        return dateTime.format(formatter)
    }
    
    fun parseDateTime(dateTimeStr: String): LocalDateTime {
        return LocalDateTime.parse(dateTimeStr, formatter)
    }
    
    fun daysBetween(start: LocalDateTime, end: LocalDateTime): Long {
        return ChronoUnit.DAYS.between(start, end)
    }
    
    fun isInFuture(dateTime: LocalDateTime): Boolean {
        return dateTime.isAfter(LocalDateTime.now())
    }
    
    fun isInPast(dateTime: LocalDateTime): Boolean {
        return dateTime.isBefore(LocalDateTime.now())
    }
}

package com.example.repositories

import com.example.models.User
import com.example.database.Database

class UserRepository {
    private val db = Database
    
    fun save(user: User) {
        db.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)",
            user.id, user.email, user.name, user.passwordHash, user.createdAt, user.updatedAt)
    }
    
    fun findById(id: String): User? {
        return db.query("SELECT * FROM users WHERE id = ?", id)
    }
    
    fun findByEmail(email: String): User? {
        return db.query("SELECT * FROM users WHERE email = ?", email)
    }
    
    fun findAll(): List<User> {
        return db.queryAll("SELECT * FROM users")
    }
    
    fun update(user: User) {
        db.execute("UPDATE users SET name = ?, updated_at = ? WHERE id = ?",
            user.name, user.updatedAt, user.id)
    }
    
    fun delete(id: String): Boolean {
        return db.execute("DELETE FROM users WHERE id = ?", id) > 0
    }
}

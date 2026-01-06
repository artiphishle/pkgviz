package com.example.repositories

import com.example.models.Project
import com.example.database.Database

class ProjectRepository {
    private val db = Database
    
    fun save(project: Project) {
        db.execute("INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?)",
            project.id, project.name, project.description, project.ownerId, 
            project.createdAt, project.updatedAt)
    }
    
    fun findById(id: String): Project? {
        return db.query("SELECT * FROM projects WHERE id = ?", id)
    }
    
    fun findByOwner(ownerId: String): List<Project> {
        return db.queryAll("SELECT * FROM projects WHERE owner_id = ?", ownerId)
    }
    
    fun findAll(): List<Project> {
        return db.queryAll("SELECT * FROM projects")
    }
    
    fun update(project: Project) {
        db.execute("UPDATE projects SET name = ?, description = ?, updated_at = ? WHERE id = ?",
            project.name, project.description, project.updatedAt, project.id)
    }
    
    fun delete(id: String): Boolean {
        return db.execute("DELETE FROM projects WHERE id = ?", id) > 0
    }
}

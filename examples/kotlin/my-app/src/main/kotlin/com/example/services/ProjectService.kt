package com.example.services

import com.example.models.Project
import com.example.repositories.ProjectRepository
import com.example.utils.Logger
import java.time.LocalDateTime
import java.util.UUID

class ProjectService {
    private val projectRepository = ProjectRepository()
    
    fun createProject(name: String, description: String, ownerId: String): Project {
        Logger.info("Creating project: $name")
        
        val project = Project(
            id = UUID.randomUUID().toString(),
            name = name,
            description = description,
            ownerId = ownerId
        )
        
        projectRepository.save(project)
        return project
    }
    
    fun getProjectById(id: String): Project? {
        return projectRepository.findById(id)
    }
    
    fun getProjectsByOwner(ownerId: String): List<Project> {
        return projectRepository.findByOwner(ownerId)
    }
    
    fun updateProject(id: String, name: String, description: String): Project? {
        val project = projectRepository.findById(id) ?: return null
        val updatedProject = project.copy(
            name = name,
            description = description,
            updatedAt = LocalDateTime.now()
        )
        projectRepository.update(updatedProject)
        return updatedProject
    }
    
    fun deleteProject(id: String): Boolean {
        return projectRepository.delete(id)
    }
}

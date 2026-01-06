package com.example.controllers

import com.example.models.Project
import com.example.services.ProjectService

class ProjectController {
    private val projectService = ProjectService()
    
    fun createProject(name: String, description: String, ownerId: String): Project {
        return projectService.createProject(name, description, ownerId)
    }
    
    fun getProject(id: String): Project? {
        return projectService.getProjectById(id)
    }
    
    fun getProjectsByOwner(ownerId: String): List<Project> {
        return projectService.getProjectsByOwner(ownerId)
    }
    
    fun updateProject(id: String, name: String, description: String): Project? {
        return projectService.updateProject(id, name, description)
    }
    
    fun deleteProject(id: String): Boolean {
        return projectService.deleteProject(id)
    }
}

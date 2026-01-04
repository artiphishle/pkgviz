#include "api/ProjectController.h"
#include "utils/Logger.h"
#include <iostream>

namespace api {

ProjectController::ProjectController(services::ProjectService& projectService, auth::AuthManager& authManager)
    : projectService(projectService), authManager(authManager) {}

void ProjectController::createProject(const std::string& name, const std::string& description) {
    projectService.createProject(name, description, 1); // Default owner ID
    std::cout << "Project created: " << name << std::endl;
}

void ProjectController::updateProject(int projectId, const std::string& name, const std::string& description) {
    projectService.updateProject(projectId, name, description);
}

void ProjectController::addMember(int projectId, int userId) {
    projectService.addMember(projectId, userId);
}

void ProjectController::deleteProject(int projectId) {
    projectService.deleteProject(projectId);
}

void ProjectController::listProjects() {
    std::cout << "Listing all projects..." << std::endl;
}

} // namespace api

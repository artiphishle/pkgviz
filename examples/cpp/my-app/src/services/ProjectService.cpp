#include "services/ProjectService.h"
#include "utils/Logger.h"

namespace services {

ProjectService::ProjectService() {}

std::shared_ptr<models::Project> ProjectService::createProject(const std::string& name, 
                                                               const std::string& description, 
                                                               int ownerId) {
    utils::Logger::getInstance().info("Creating project: " + name);
    auto project = projectRepo.create(name, description, ownerId);
    notificationService.sendNotification(ownerId, "Project created: " + name);
    return project;
}

void ProjectService::updateProject(int projectId, const std::string& name, const std::string& description) {
    utils::Logger::getInstance().info("Updating project: " + std::to_string(projectId));
    projectRepo.update(projectId, name, description);
}

void ProjectService::addMember(int projectId, int userId) {
    utils::Logger::getInstance().info("Adding member to project " + std::to_string(projectId));
    auto project = projectRepo.findById(projectId);
    if (project) {
        project->addMember(userId);
        projectRepo.save(*project);
        notificationService.sendNotification(userId, "You have been added to project: " + project->getName());
    }
}

void ProjectService::removeMember(int projectId, int userId) {
    auto project = projectRepo.findById(projectId);
    if (project) {
        project->removeMember(userId);
        projectRepo.save(*project);
    }
}

void ProjectService::deleteProject(int projectId) {
    utils::Logger::getInstance().info("Deleting project: " + std::to_string(projectId));
    projectRepo.deleteById(projectId);
}

std::vector<models::Project> ProjectService::getProjectsByOwner(int ownerId) {
    return projectRepo.findByOwner(ownerId);
}

std::shared_ptr<models::Project> ProjectService::getProjectById(int projectId) {
    return projectRepo.findById(projectId);
}

} // namespace services

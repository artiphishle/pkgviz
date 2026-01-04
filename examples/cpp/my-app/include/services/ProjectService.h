#ifndef PROJECT_SERVICE_H
#define PROJECT_SERVICE_H

#include <vector>
#include <memory>
#include "models/Project.h"
#include "database/ProjectRepository.h"
#include "services/NotificationService.h"

namespace services {

class ProjectService {
private:
    database::ProjectRepository projectRepo;
    NotificationService notificationService;

public:
    ProjectService();
    std::shared_ptr<models::Project> createProject(const std::string& name, 
                                                   const std::string& description, 
                                                   int ownerId);
    void updateProject(int projectId, const std::string& name, const std::string& description);
    void addMember(int projectId, int userId);
    void removeMember(int projectId, int userId);
    void deleteProject(int projectId);
    std::vector<models::Project> getProjectsByOwner(int ownerId);
    std::shared_ptr<models::Project> getProjectById(int projectId);
};

} // namespace services

#endif // PROJECT_SERVICE_H

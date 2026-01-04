#ifndef PROJECT_CONTROLLER_H
#define PROJECT_CONTROLLER_H

#include <string>
#include "services/ProjectService.h"
#include "auth/AuthManager.h"

namespace api {

class ProjectController {
private:
    services::ProjectService& projectService;
    auth::AuthManager& authManager;

public:
    ProjectController(services::ProjectService& projectService, auth::AuthManager& authManager);
    
    void createProject(const std::string& name, const std::string& description);
    void updateProject(int projectId, const std::string& name, const std::string& description);
    void addMember(int projectId, int userId);
    void deleteProject(int projectId);
    void listProjects();
};

} // namespace api

#endif // PROJECT_CONTROLLER_H

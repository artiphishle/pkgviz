#ifndef TASK_CONTROLLER_H
#define TASK_CONTROLLER_H

#include <string>
#include "services/TaskService.h"
#include "auth/AuthManager.h"
#include "validation/TaskValidator.h"

namespace api {

class TaskController {
private:
    services::TaskService& taskService;
    auth::AuthManager& authManager;
    validation::TaskValidator validator;

public:
    TaskController(services::TaskService& taskService, auth::AuthManager& authManager);
    
    void createTask(const std::string& title, const std::string& description, int projectId);
    void updateTask(int taskId, const std::string& title, const std::string& description);
    void assignTask(int taskId, int userId);
    void deleteTask(int taskId);
    void listTasks();
};

} // namespace api

#endif // TASK_CONTROLLER_H

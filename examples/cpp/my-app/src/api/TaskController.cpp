#include "api/TaskController.h"
#include "utils/Logger.h"
#include <iostream>

namespace api {

TaskController::TaskController(services::TaskService& taskService, auth::AuthManager& authManager)
    : taskService(taskService), authManager(authManager) {}

void TaskController::createTask(const std::string& title, const std::string& description, int projectId) {
    if (!validator.validateTitle(title)) {
        utils::Logger::getInstance().error("Invalid task title");
        return;
    }
    
    taskService.createTask(title, description, projectId);
    std::cout << "Task created: " << title << std::endl;
}

void TaskController::updateTask(int taskId, const std::string& title, const std::string& description) {
    taskService.updateTask(taskId, title, description);
}

void TaskController::assignTask(int taskId, int userId) {
    taskService.assignTask(taskId, userId);
}

void TaskController::deleteTask(int taskId) {
    taskService.deleteTask(taskId);
}

void TaskController::listTasks() {
    std::cout << "Listing all tasks..." << std::endl;
}

} // namespace api

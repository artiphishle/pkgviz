#include "services/TaskService.h"
#include "utils/Logger.h"

namespace services {

TaskService::TaskService() {}

std::shared_ptr<models::Task> TaskService::createTask(const std::string& title, 
                                                      const std::string& description, 
                                                      int projectId) {
    utils::Logger::getInstance().info("Creating task: " + title);
    auto task = taskRepo.create(title, description, projectId);
    notificationService.sendNotification(projectId, "New task created: " + title);
    return task;
}

void TaskService::updateTask(int taskId, const std::string& title, const std::string& description) {
    utils::Logger::getInstance().info("Updating task: " + std::to_string(taskId));
    taskRepo.update(taskId, title, description);
}

void TaskService::assignTask(int taskId, int userId) {
    utils::Logger::getInstance().info("Assigning task " + std::to_string(taskId) + " to user " + std::to_string(userId));
    auto task = taskRepo.findById(taskId);
    if (task) {
        task->setAssignee(userId);
        taskRepo.save(*task);
        notificationService.sendNotification(userId, "You have been assigned to task: " + task->getTitle());
    }
}

void TaskService::updateTaskStatus(int taskId, models::TaskStatus status) {
    auto task = taskRepo.findById(taskId);
    if (task) {
        task->setStatus(status);
        taskRepo.save(*task);
    }
}

void TaskService::deleteTask(int taskId) {
    utils::Logger::getInstance().info("Deleting task: " + std::to_string(taskId));
    taskRepo.deleteById(taskId);
}

std::vector<models::Task> TaskService::getTasksByProject(int projectId) {
    return taskRepo.findByProject(projectId);
}

std::vector<models::Task> TaskService::getTasksByUser(int userId) {
    return taskRepo.findByUser(userId);
}

std::shared_ptr<models::Task> TaskService::getTaskById(int taskId) {
    return taskRepo.findById(taskId);
}

} // namespace services

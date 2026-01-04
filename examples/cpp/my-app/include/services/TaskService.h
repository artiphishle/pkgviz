#ifndef TASK_SERVICE_H
#define TASK_SERVICE_H

#include <vector>
#include <memory>
#include "models/Task.h"
#include "database/TaskRepository.h"
#include "services/NotificationService.h"

namespace services {

class TaskService {
private:
    database::TaskRepository taskRepo;
    NotificationService notificationService;

public:
    TaskService();
    std::shared_ptr<models::Task> createTask(const std::string& title, 
                                             const std::string& description, 
                                             int projectId);
    void updateTask(int taskId, const std::string& title, const std::string& description);
    void assignTask(int taskId, int userId);
    void updateTaskStatus(int taskId, models::TaskStatus status);
    void deleteTask(int taskId);
    std::vector<models::Task> getTasksByProject(int projectId);
    std::vector<models::Task> getTasksByUser(int userId);
    std::shared_ptr<models::Task> getTaskById(int taskId);
};

} // namespace services

#endif // TASK_SERVICE_H

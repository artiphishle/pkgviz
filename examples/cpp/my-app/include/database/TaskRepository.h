#ifndef TASK_REPOSITORY_H
#define TASK_REPOSITORY_H

#include <vector>
#include <memory>
#include "models/Task.h"
#include "database/Database.h"

namespace database {

class TaskRepository {
private:
    Database& db;

public:
    TaskRepository();
    std::shared_ptr<models::Task> create(const std::string& title, const std::string& description, int projectId);
    std::shared_ptr<models::Task> findById(int id);
    std::vector<models::Task> findByProject(int projectId);
    std::vector<models::Task> findByUser(int userId);
    std::vector<models::Task> findAll();
    void update(int id, const std::string& title, const std::string& description);
    void deleteById(int id);
    void save(const models::Task& task);
};

} // namespace database

#endif // TASK_REPOSITORY_H

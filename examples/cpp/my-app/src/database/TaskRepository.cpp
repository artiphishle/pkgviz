#include "database/TaskRepository.h"
#include "utils/Logger.h"

namespace database {

TaskRepository::TaskRepository() : db(Database::getInstance()) {}

std::shared_ptr<models::Task> TaskRepository::create(const std::string& title, const std::string& description, int projectId) {
    db.execute("INSERT INTO tasks (title, description, project_id) VALUES ('" + title + "', '" + description + "', " + std::to_string(projectId) + ")");
    return std::make_shared<models::Task>(1, title, description, projectId);
}

std::shared_ptr<models::Task> TaskRepository::findById(int id) {
    db.execute("SELECT * FROM tasks WHERE id = " + std::to_string(id));
    return nullptr;
}

std::vector<models::Task> TaskRepository::findByProject(int projectId) {
    db.execute("SELECT * FROM tasks WHERE project_id = " + std::to_string(projectId));
    return {};
}

std::vector<models::Task> TaskRepository::findByUser(int userId) {
    db.execute("SELECT * FROM tasks WHERE assignee_id = " + std::to_string(userId));
    return {};
}

std::vector<models::Task> TaskRepository::findAll() {
    db.execute("SELECT * FROM tasks");
    return {};
}

void TaskRepository::update(int id, const std::string& title, const std::string& description) {
    db.execute("UPDATE tasks SET title = '" + title + "', description = '" + description + "' WHERE id = " + std::to_string(id));
}

void TaskRepository::deleteById(int id) {
    db.execute("DELETE FROM tasks WHERE id = " + std::to_string(id));
}

void TaskRepository::save(const models::Task& task) {
    db.execute("UPDATE tasks SET title = '" + task.getTitle() + "' WHERE id = " + std::to_string(task.getId()));
}

} // namespace database

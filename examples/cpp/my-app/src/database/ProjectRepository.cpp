#include "database/ProjectRepository.h"
#include "utils/Logger.h"

namespace database {

ProjectRepository::ProjectRepository() : db(Database::getInstance()) {}

std::shared_ptr<models::Project> ProjectRepository::create(const std::string& name, const std::string& description, int ownerId) {
    db.execute("INSERT INTO projects (name, description, owner_id) VALUES ('" + name + "', '" + description + "', " + std::to_string(ownerId) + ")");
    return std::make_shared<models::Project>(1, name, description, ownerId);
}

std::shared_ptr<models::Project> ProjectRepository::findById(int id) {
    db.execute("SELECT * FROM projects WHERE id = " + std::to_string(id));
    return nullptr;
}

std::vector<models::Project> ProjectRepository::findByOwner(int ownerId) {
    db.execute("SELECT * FROM projects WHERE owner_id = " + std::to_string(ownerId));
    return {};
}

std::vector<models::Project> ProjectRepository::findAll() {
    db.execute("SELECT * FROM projects");
    return {};
}

void ProjectRepository::update(int id, const std::string& name, const std::string& description) {
    db.execute("UPDATE projects SET name = '" + name + "', description = '" + description + "' WHERE id = " + std::to_string(id));
}

void ProjectRepository::deleteById(int id) {
    db.execute("DELETE FROM projects WHERE id = " + std::to_string(id));
}

void ProjectRepository::save(const models::Project& project) {
    db.execute("UPDATE projects SET name = '" + project.getName() + "' WHERE id = " + std::to_string(project.getId()));
}

} // namespace database

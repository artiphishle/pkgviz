#ifndef PROJECT_REPOSITORY_H
#define PROJECT_REPOSITORY_H

#include <vector>
#include <memory>
#include "models/Project.h"
#include "database/Database.h"

namespace database {

class ProjectRepository {
private:
    Database& db;

public:
    ProjectRepository();
    std::shared_ptr<models::Project> create(const std::string& name, const std::string& description, int ownerId);
    std::shared_ptr<models::Project> findById(int id);
    std::vector<models::Project> findByOwner(int ownerId);
    std::vector<models::Project> findAll();
    void update(int id, const std::string& name, const std::string& description);
    void deleteById(int id);
    void save(const models::Project& project);
};

} // namespace database

#endif // PROJECT_REPOSITORY_H

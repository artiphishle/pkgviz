#ifndef USER_REPOSITORY_H
#define USER_REPOSITORY_H

#include <vector>
#include <memory>
#include "models/User.h"
#include "database/Database.h"

namespace database {

class UserRepository {
private:
    Database& db;

public:
    UserRepository();
    std::shared_ptr<models::User> create(const std::string& name, const std::string& email);
    std::shared_ptr<models::User> findById(int id);
    std::shared_ptr<models::User> findByEmail(const std::string& email);
    std::vector<models::User> findAll();
    void update(int id, const std::string& name, const std::string& email);
    void deleteById(int id);
    void save(const models::User& user);
};

} // namespace database

#endif // USER_REPOSITORY_H

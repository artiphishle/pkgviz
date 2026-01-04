#include "database/UserRepository.h"
#include "utils/Logger.h"

namespace database {

UserRepository::UserRepository() : db(Database::getInstance()) {}

std::shared_ptr<models::User> UserRepository::create(const std::string& name, const std::string& email) {
    db.execute("INSERT INTO users (name, email) VALUES ('" + name + "', '" + email + "')");
    return std::make_shared<models::User>(name, email);
}

std::shared_ptr<models::User> UserRepository::findById(int id) {
    db.execute("SELECT * FROM users WHERE id = " + std::to_string(id));
    return nullptr; // Simplified
}

std::shared_ptr<models::User> UserRepository::findByEmail(const std::string& email) {
    db.execute("SELECT * FROM users WHERE email = '" + email + "'");
    return std::make_shared<models::User>("", email); // Simplified
}

std::vector<models::User> UserRepository::findAll() {
    db.execute("SELECT * FROM users");
    return {};
}

void UserRepository::update(int id, const std::string& name, const std::string& email) {
    db.execute("UPDATE users SET name = '" + name + "', email = '" + email + "' WHERE id = " + std::to_string(id));
}

void UserRepository::deleteById(int id) {
    db.execute("DELETE FROM users WHERE id = " + std::to_string(id));
}

void UserRepository::save(const models::User& user) {
    db.execute("UPDATE users SET name = '" + user.getName() + "', email = '" + user.getEmail() + "'");
}

} // namespace database

#include "services/UserService.h"
#include <iostream>

namespace services {

void UserService::createUser(const std::string& name, const std::string& email) {
    models::User user(name, email);
    users.push_back(user);
    std::cout << "User created: " << name << " (" << email << ")" << std::endl;
}

void UserService::listUsers() const {
    std::cout << "Users:" << std::endl;
    for (const auto& user : users) {
        std::cout << "  - " << user.getName() << " (" << user.getEmail() << ")" << std::endl;
    }
}

size_t UserService::getUserCount() const {
    return users.size();
}

} // namespace services

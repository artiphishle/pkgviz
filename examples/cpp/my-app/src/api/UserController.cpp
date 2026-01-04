#include "api/UserController.h"
#include "utils/Logger.h"
#include <iostream>

namespace api {

UserController::UserController(services::UserService& userService, auth::AuthManager& authManager)
    : userService(userService), authManager(authManager) {}

void UserController::registerUser(const std::string& email, const std::string& password, const std::string& name) {
    if (!validator.validateEmail(email)) {
        utils::Logger::getInstance().error("Invalid email format");
        return;
    }
    
    if (!validator.validatePassword(password)) {
        utils::Logger::getInstance().error("Invalid password");
        return;
    }
    
    userService.createUser(name, email);
    utils::Logger::getInstance().info("User registered successfully: " + email);
}

void UserController::updateProfile(int userId, const std::string& name) {
    userService.updateUser(userId, name, "");
}

void UserController::deleteUser(int userId) {
    userService.deleteUser(userId);
}

void UserController::getUserProfile(int userId) {
    auto user = userService.getUserById(userId);
    if (user) {
        std::cout << "User: " << user->getName() << " (" << user->getEmail() << ")" << std::endl;
    }
}

void UserController::listUsers() {
    userService.listUsers();
}

} // namespace api

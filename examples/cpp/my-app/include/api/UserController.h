#ifndef USER_CONTROLLER_H
#define USER_CONTROLLER_H

#include <string>
#include "services/UserService.h"
#include "auth/AuthManager.h"
#include "validation/UserValidator.h"

namespace api {

class UserController {
private:
    services::UserService& userService;
    auth::AuthManager& authManager;
    validation::UserValidator validator;

public:
    UserController(services::UserService& userService, auth::AuthManager& authManager);
    
    void registerUser(const std::string& email, const std::string& password, const std::string& name);
    void updateProfile(int userId, const std::string& name);
    void deleteUser(int userId);
    void getUserProfile(int userId);
    void listUsers();
};

} // namespace api

#endif // USER_CONTROLLER_H

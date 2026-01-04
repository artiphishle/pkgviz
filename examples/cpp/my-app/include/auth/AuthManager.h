#ifndef AUTH_MANAGER_H
#define AUTH_MANAGER_H

#include <string>
#include <memory>
#include "auth/Session.h"
#include "database/UserRepository.h"

namespace auth {

class AuthManager {
private:
    database::UserRepository userRepo;

public:
    AuthManager();
    std::shared_ptr<Session> login(const std::string& email, const std::string& password);
    void logout(const std::string& sessionId);
    bool validateSession(const std::string& sessionId);
    std::string hashPassword(const std::string& password);
    bool verifyPassword(const std::string& password, const std::string& hash);
};

} // namespace auth

#endif // AUTH_MANAGER_H

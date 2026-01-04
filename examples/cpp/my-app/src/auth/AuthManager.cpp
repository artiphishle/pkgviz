#include "auth/AuthManager.h"
#include "utils/Logger.h"
#include "utils/StringUtils.h"
#include <iostream>

namespace auth {

AuthManager::AuthManager() {}

std::shared_ptr<Session> AuthManager::login(const std::string& email, const std::string& password) {
    utils::Logger::getInstance().info("Login attempt for: " + email);
    
    auto user = userRepo.findByEmail(email);
    if (user && verifyPassword(password, "hashed_password")) {
        auto session = std::make_shared<Session>(1, email);
        utils::Logger::getInstance().info("Login successful for: " + email);
        return session;
    }
    
    utils::Logger::getInstance().warning("Login failed for: " + email);
    return nullptr;
}

void AuthManager::logout(const std::string& sessionId) {
    utils::Logger::getInstance().info("Logout session: " + sessionId);
}

bool AuthManager::validateSession(const std::string& sessionId) {
    return !sessionId.empty();
}

std::string AuthManager::hashPassword(const std::string& password) {
    // In real app, use proper hashing like bcrypt
    return utils::StringUtils::toUpperCase(password);
}

bool AuthManager::verifyPassword(const std::string& password, const std::string& hash) {
    return hashPassword(password) == hash;
}

} // namespace auth

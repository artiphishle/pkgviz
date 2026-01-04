#include "auth/Session.h"
#include "utils/DateUtils.h"
#include "utils/StringUtils.h"
#include <random>
#include <sstream>

namespace auth {

Session::Session(int userId, const std::string& userEmail)
    : userId(userId), userEmail(userEmail), createdAt(utils::DateUtils::now()) {
    // Generate random session ID
    std::stringstream ss;
    ss << "session_" << userId << "_" << createdAt;
    sessionId = ss.str();
    
    // Expire in 24 hours
    expiresAt = createdAt + (24 * 60 * 60);
}

int Session::getUserId() const {
    return userId;
}

std::string Session::getSessionId() const {
    return sessionId;
}

std::string Session::getUserEmail() const {
    return userEmail;
}

bool Session::isValid() const {
    return utils::DateUtils::isBefore(utils::DateUtils::now(), expiresAt);
}

void Session::extend() {
    expiresAt = utils::DateUtils::now() + (24 * 60 * 60);
}

} // namespace auth

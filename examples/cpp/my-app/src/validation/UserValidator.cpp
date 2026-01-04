#include "validation/UserValidator.h"
#include "utils/Logger.h"

namespace validation {

bool UserValidator::validateEmail(const std::string& email) {
    if (!Validator::isNotEmpty(email)) {
        utils::Logger::getInstance().error("Email cannot be empty");
        return false;
    }
    if (!Validator::isEmail(email)) {
        utils::Logger::getInstance().error("Invalid email format");
        return false;
    }
    return true;
}

bool UserValidator::validatePassword(const std::string& password) {
    if (!Validator::hasMinLength(password, 8)) {
        utils::Logger::getInstance().error("Password must be at least 8 characters");
        return false;
    }
    return true;
}

bool UserValidator::validateName(const std::string& name) {
    return Validator::isNotEmpty(name) && Validator::hasMaxLength(name, 100);
}

} // namespace validation

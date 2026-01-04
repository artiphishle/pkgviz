#include "validation/TaskValidator.h"
#include "utils/Logger.h"

namespace validation {

bool TaskValidator::validateTitle(const std::string& title) {
    if (!Validator::isNotEmpty(title)) {
        utils::Logger::getInstance().error("Task title cannot be empty");
        return false;
    }
    if (!Validator::hasMaxLength(title, 200)) {
        utils::Logger::getInstance().error("Task title too long");
        return false;
    }
    return true;
}

bool TaskValidator::validateDescription(const std::string& description) {
    return Validator::hasMaxLength(description, 5000);
}

} // namespace validation

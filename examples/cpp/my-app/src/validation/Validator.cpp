#include "validation/Validator.h"
#include "utils/StringUtils.h"

namespace validation {

bool Validator::isNotEmpty(const std::string& str) {
    return !utils::StringUtils::trim(str).empty();
}

bool Validator::hasMinLength(const std::string& str, size_t minLength) {
    return str.length() >= minLength;
}

bool Validator::hasMaxLength(const std::string& str, size_t maxLength) {
    return str.length() <= maxLength;
}

bool Validator::isEmail(const std::string& email) {
    return utils::StringUtils::contains(email, "@") && utils::StringUtils::contains(email, ".");
}

} // namespace validation

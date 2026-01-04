#ifndef VALIDATOR_H
#define VALIDATOR_H

#include <string>

namespace validation {

class Validator {
public:
    static bool isNotEmpty(const std::string& str);
    static bool hasMinLength(const std::string& str, size_t minLength);
    static bool hasMaxLength(const std::string& str, size_t maxLength);
    static bool isEmail(const std::string& email);
};

} // namespace validation

#endif // VALIDATOR_H

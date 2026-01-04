#ifndef USER_VALIDATOR_H
#define USER_VALIDATOR_H

#include <string>
#include "validation/Validator.h"

namespace validation {

class UserValidator {
public:
    bool validateEmail(const std::string& email);
    bool validatePassword(const std::string& password);
    bool validateName(const std::string& name);
};

} // namespace validation

#endif // USER_VALIDATOR_H

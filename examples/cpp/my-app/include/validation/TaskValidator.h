#ifndef TASK_VALIDATOR_H
#define TASK_VALIDATOR_H

#include <string>
#include "validation/Validator.h"

namespace validation {

class TaskValidator {
public:
    bool validateTitle(const std::string& title);
    bool validateDescription(const std::string& description);
};

} // namespace validation

#endif // TASK_VALIDATOR_H

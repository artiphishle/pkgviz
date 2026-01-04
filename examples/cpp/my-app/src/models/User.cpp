#include "models/User.h"

namespace models {

User::User(const std::string& name, const std::string& email) 
    : name(name), email(email) {}

std::string User::getName() const {
    return name;
}

std::string User::getEmail() const {
    return email;
}

void User::setName(const std::string& newName) {
    name = newName;
}

void User::setEmail(const std::string& newEmail) {
    email = newEmail;
}

} // namespace models

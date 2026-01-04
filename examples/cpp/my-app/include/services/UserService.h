#ifndef USER_SERVICE_H
#define USER_SERVICE_H

#include <vector>
#include "models/User.h"

namespace services {

class UserService {
private:
    std::vector<models::User> users;

public:
    void createUser(const std::string& name, const std::string& email);
    void listUsers() const;
    size_t getUserCount() const;
};

} // namespace services

#endif // USER_SERVICE_H

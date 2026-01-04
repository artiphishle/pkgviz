#ifndef USER_H
#define USER_H

#include <string>

namespace models {

class User {
private:
    std::string name;
    std::string email;

public:
    User(const std::string& name, const std::string& email);
    std::string getName() const;
    std::string getEmail() const;
    void setName(const std::string& newName);
    void setEmail(const std::string& newEmail);
};

} // namespace models

#endif // USER_H

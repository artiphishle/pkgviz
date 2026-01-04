#ifndef SESSION_H
#define SESSION_H

#include <string>
#include <ctime>

namespace auth {

class Session {
private:
    int userId;
    std::string sessionId;
    std::string userEmail;
    std::time_t createdAt;
    std::time_t expiresAt;

public:
    Session(int userId, const std::string& userEmail);
    
    int getUserId() const;
    std::string getSessionId() const;
    std::string getUserEmail() const;
    bool isValid() const;
    void extend();
};

} // namespace auth

#endif // SESSION_H

#ifndef NOTIFICATION_SERVICE_H
#define NOTIFICATION_SERVICE_H

#include <string>
#include <vector>

namespace services {

class NotificationService {
public:
    void sendNotification(int userId, const std::string& message);
    void sendEmailNotification(const std::string& email, const std::string& subject, const std::string& body);
    std::vector<std::string> getNotifications(int userId);
};

} // namespace services

#endif // NOTIFICATION_SERVICE_H

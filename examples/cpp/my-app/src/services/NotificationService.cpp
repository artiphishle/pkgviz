#include "services/NotificationService.h"
#include "utils/Logger.h"
#include <iostream>

namespace services {

void NotificationService::sendNotification(int userId, const std::string& message) {
    utils::Logger::getInstance().info("Sending notification to user " + std::to_string(userId) + ": " + message);
    std::cout << "Notification for user " << userId << ": " << message << std::endl;
}

void NotificationService::sendEmailNotification(const std::string& email, const std::string& subject, const std::string& body) {
    utils::Logger::getInstance().info("Sending email to " + email + " - Subject: " + subject);
    std::cout << "Email to " << email << "\nSubject: " << subject << "\n" << body << std::endl;
}

std::vector<std::string> NotificationService::getNotifications(int userId) {
    // In a real app, this would fetch from database
    return {};
}

} // namespace services

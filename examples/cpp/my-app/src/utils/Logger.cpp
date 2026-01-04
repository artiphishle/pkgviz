#include "utils/Logger.h"
#include "utils/DateUtils.h"
#include <iostream>

namespace utils {

Logger::Logger() {
    logFile.open("app.log", std::ios::app);
}

Logger::~Logger() {
    if (logFile.is_open()) {
        logFile.close();
    }
}

Logger& Logger::getInstance() {
    static Logger instance;
    return instance;
}

void Logger::info(const std::string& message) {
    std::string timestamp = DateUtils::formatDate(DateUtils::now());
    std::string logMessage = "[INFO] " + timestamp + " - " + message;
    std::cout << logMessage << std::endl;
    if (logFile.is_open()) {
        logFile << logMessage << std::endl;
    }
}

void Logger::warning(const std::string& message) {
    std::string timestamp = DateUtils::formatDate(DateUtils::now());
    std::string logMessage = "[WARNING] " + timestamp + " - " + message;
    std::cout << logMessage << std::endl;
    if (logFile.is_open()) {
        logFile << logMessage << std::endl;
    }
}

void Logger::error(const std::string& message) {
    std::string timestamp = DateUtils::formatDate(DateUtils::now());
    std::string logMessage = "[ERROR] " + timestamp + " - " + message;
    std::cerr << logMessage << std::endl;
    if (logFile.is_open()) {
        logFile << logMessage << std::endl;
    }
}

void Logger::debug(const std::string& message) {
    std::string timestamp = DateUtils::formatDate(DateUtils::now());
    std::string logMessage = "[DEBUG] " + timestamp + " - " + message;
    std::cout << logMessage << std::endl;
    if (logFile.is_open()) {
        logFile << logMessage << std::endl;
    }
}

} // namespace utils

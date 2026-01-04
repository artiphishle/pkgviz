#ifndef LOGGER_H
#define LOGGER_H

#include <string>
#include <fstream>

namespace utils {

class Logger {
private:
    std::ofstream logFile;
    Logger();
    ~Logger();

public:
    static Logger& getInstance();
    void info(const std::string& message);
    void warning(const std::string& message);
    void error(const std::string& message);
    void debug(const std::string& message);
    
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;
};

} // namespace utils

#endif // LOGGER_H

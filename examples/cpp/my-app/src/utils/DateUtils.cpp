#include "utils/DateUtils.h"
#include <sstream>
#include <iomanip>

namespace utils {

std::time_t DateUtils::now() {
    return std::time(nullptr);
}

std::string DateUtils::formatDate(std::time_t time) {
    std::tm* tm = std::localtime(&time);
    std::stringstream ss;
    ss << std::put_time(tm, "%Y-%m-%d %H:%M:%S");
    return ss.str();
}

std::time_t DateUtils::parseDate(const std::string& dateStr) {
    // Simplified date parsing
    return std::time(nullptr);
}

bool DateUtils::isBefore(std::time_t date1, std::time_t date2) {
    return date1 < date2;
}

int DateUtils::daysBetween(std::time_t date1, std::time_t date2) {
    double seconds = std::difftime(date2, date1);
    return static_cast<int>(seconds / (60 * 60 * 24));
}

} // namespace utils

#ifndef DATE_UTILS_H
#define DATE_UTILS_H

#include <string>
#include <ctime>

namespace utils {

class DateUtils {
public:
    static std::time_t now();
    static std::string formatDate(std::time_t time);
    static std::time_t parseDate(const std::string& dateStr);
    static bool isBefore(std::time_t date1, std::time_t date2);
    static int daysBetween(std::time_t date1, std::time_t date2);
};

} // namespace utils

#endif // DATE_UTILS_H

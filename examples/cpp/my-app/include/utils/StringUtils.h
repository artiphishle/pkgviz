#ifndef STRING_UTILS_H
#define STRING_UTILS_H

#include <string>
#include <vector>

namespace utils {

class StringUtils {
public:
    static std::string trim(const std::string& str);
    static std::string toLowerCase(const std::string& str);
    static std::string toUpperCase(const std::string& str);
    static std::vector<std::string> split(const std::string& str, char delimiter);
    static bool contains(const std::string& str, const std::string& substr);
    static std::string replace(const std::string& str, const std::string& from, const std::string& to);
};

} // namespace utils

#endif // STRING_UTILS_H

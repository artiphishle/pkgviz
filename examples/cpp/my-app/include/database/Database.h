#ifndef DATABASE_H
#define DATABASE_H

#include <string>
#include <memory>

namespace database {

class Database {
private:
    std::string connectionString;
    bool connected;
    
    Database();
    ~Database();

public:
    static Database& getInstance();
    
    bool connect(const std::string& connStr);
    void disconnect();
    bool isConnected() const;
    void execute(const std::string& query);
    
    Database(const Database&) = delete;
    Database& operator=(const Database&) = delete;
};

} // namespace database

#endif // DATABASE_H

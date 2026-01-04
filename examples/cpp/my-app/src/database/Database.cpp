#include "database/Database.h"
#include "utils/Logger.h"
#include <iostream>

namespace database {

Database::Database() : connected(false) {}

Database::~Database() {
    if (connected) {
        disconnect();
    }
}

Database& Database::getInstance() {
    static Database instance;
    return instance;
}

bool Database::connect(const std::string& connStr) {
    utils::Logger::getInstance().info("Connecting to database: " + connStr);
    connectionString = connStr;
    connected = true;
    std::cout << "Database connected successfully" << std::endl;
    return true;
}

void Database::disconnect() {
    utils::Logger::getInstance().info("Disconnecting from database");
    connected = false;
    std::cout << "Database disconnected" << std::endl;
}

bool Database::isConnected() const {
    return connected;
}

void Database::execute(const std::string& query) {
    if (!connected) {
        utils::Logger::getInstance().error("Cannot execute query: Database not connected");
        return;
    }
    utils::Logger::getInstance().debug("Executing query: " + query);
}

} // namespace database

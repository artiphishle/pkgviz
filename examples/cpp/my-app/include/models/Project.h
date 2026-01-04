#ifndef PROJECT_H
#define PROJECT_H

#include <string>
#include <vector>
#include <ctime>

namespace models {

class Project {
private:
    int id;
    std::string name;
    std::string description;
    int ownerId;
    std::time_t createdAt;
    std::vector<int> memberIds;

public:
    Project(int id, const std::string& name, const std::string& description, int ownerId);
    
    int getId() const;
    std::string getName() const;
    std::string getDescription() const;
    int getOwnerId() const;
    std::time_t getCreatedAt() const;
    
    void setName(const std::string& newName);
    void setDescription(const std::string& newDescription);
    void addMember(int userId);
    void removeMember(int userId);
    bool hasMember(int userId) const;
};

} // namespace models

#endif // PROJECT_H

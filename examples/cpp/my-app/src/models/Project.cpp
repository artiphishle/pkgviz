#include "models/Project.h"
#include "utils/DateUtils.h"
#include <algorithm>

namespace models {

Project::Project(int id, const std::string& name, const std::string& description, int ownerId)
    : id(id), name(name), description(description), ownerId(ownerId),
      createdAt(utils::DateUtils::now()) {}

int Project::getId() const {
    return id;
}

std::string Project::getName() const {
    return name;
}

std::string Project::getDescription() const {
    return description;
}

int Project::getOwnerId() const {
    return ownerId;
}

std::time_t Project::getCreatedAt() const {
    return createdAt;
}

void Project::setName(const std::string& newName) {
    name = newName;
}

void Project::setDescription(const std::string& newDescription) {
    description = newDescription;
}

void Project::addMember(int userId) {
    if (!hasMember(userId)) {
        memberIds.push_back(userId);
    }
}

void Project::removeMember(int userId) {
    memberIds.erase(std::remove(memberIds.begin(), memberIds.end(), userId), memberIds.end());
}

bool Project::hasMember(int userId) const {
    return std::find(memberIds.begin(), memberIds.end(), userId) != memberIds.end();
}

} // namespace models

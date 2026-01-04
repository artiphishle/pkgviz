#include "models/Task.h"
#include "utils/DateUtils.h"

namespace models {

Task::Task(int id, const std::string& title, const std::string& description, int projectId)
    : id(id), title(title), description(description), projectId(projectId),
      status(TaskStatus::TODO), priority(TaskPriority::MEDIUM),
      assigneeId(-1), createdAt(utils::DateUtils::now()), dueDate(0) {}

int Task::getId() const {
    return id;
}

std::string Task::getTitle() const {
    return title;
}

std::string Task::getDescription() const {
    return description;
}

TaskStatus Task::getStatus() const {
    return status;
}

TaskPriority Task::getPriority() const {
    return priority;
}

int Task::getProjectId() const {
    return projectId;
}

int Task::getAssigneeId() const {
    return assigneeId;
}

void Task::setTitle(const std::string& newTitle) {
    title = newTitle;
}

void Task::setDescription(const std::string& newDescription) {
    description = newDescription;
}

void Task::setStatus(TaskStatus newStatus) {
    status = newStatus;
}

void Task::setPriority(TaskPriority newPriority) {
    priority = newPriority;
}

void Task::setAssignee(int userId) {
    assigneeId = userId;
}

void Task::setDueDate(std::time_t date) {
    dueDate = date;
}

void Task::addComment(const Comment& comment) {
    comments.push_back(comment);
}

} // namespace models

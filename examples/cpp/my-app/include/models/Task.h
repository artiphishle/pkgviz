#ifndef TASK_H
#define TASK_H

#include <string>
#include <ctime>
#include <vector>
#include "models/Comment.h"

namespace models {

enum class TaskStatus {
    TODO,
    IN_PROGRESS,
    REVIEW,
    DONE
};

enum class TaskPriority {
    LOW,
    MEDIUM,
    HIGH,
    URGENT
};

class Task {
private:
    int id;
    std::string title;
    std::string description;
    TaskStatus status;
    TaskPriority priority;
    int projectId;
    int assigneeId;
    std::time_t createdAt;
    std::time_t dueDate;
    std::vector<Comment> comments;

public:
    Task(int id, const std::string& title, const std::string& description, int projectId);
    
    int getId() const;
    std::string getTitle() const;
    std::string getDescription() const;
    TaskStatus getStatus() const;
    TaskPriority getPriority() const;
    int getProjectId() const;
    int getAssigneeId() const;
    
    void setTitle(const std::string& newTitle);
    void setDescription(const std::string& newDescription);
    void setStatus(TaskStatus newStatus);
    void setPriority(TaskPriority newPriority);
    void setAssignee(int userId);
    void setDueDate(std::time_t date);
    void addComment(const Comment& comment);
};

} // namespace models

#endif // TASK_H

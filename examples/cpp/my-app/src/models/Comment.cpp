#include "models/Comment.h"
#include "utils/DateUtils.h"

namespace models {

Comment::Comment(int id, int taskId, int authorId, const std::string& content)
    : id(id), taskId(taskId), authorId(authorId), content(content),
      createdAt(utils::DateUtils::now()) {}

int Comment::getId() const {
    return id;
}

int Comment::getTaskId() const {
    return taskId;
}

int Comment::getAuthorId() const {
    return authorId;
}

std::string Comment::getContent() const {
    return content;
}

std::time_t Comment::getCreatedAt() const {
    return createdAt;
}

void Comment::setContent(const std::string& newContent) {
    content = newContent;
}

} // namespace models

#ifndef COMMENT_H
#define COMMENT_H

#include <string>
#include <ctime>

namespace models {

class Comment {
private:
    int id;
    int taskId;
    int authorId;
    std::string content;
    std::time_t createdAt;

public:
    Comment(int id, int taskId, int authorId, const std::string& content);
    
    int getId() const;
    int getTaskId() const;
    int getAuthorId() const;
    std::string getContent() const;
    std::time_t getCreatedAt() const;
    
    void setContent(const std::string& newContent);
};

} // namespace models

#endif // COMMENT_H

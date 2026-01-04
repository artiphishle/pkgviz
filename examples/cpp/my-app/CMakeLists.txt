cmake_minimum_required(VERSION 3.10)
project(TaskManager VERSION 1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add executable
add_executable(taskmanager
    src/main.cpp
    src/utils/Calculator.cpp
    src/utils/StringUtils.cpp
    src/utils/DateUtils.cpp
    src/utils/Logger.cpp
    src/models/User.cpp
    src/models/Task.cpp
    src/models/Project.cpp
    src/models/Comment.cpp
    src/services/UserService.cpp
    src/services/TaskService.cpp
    src/services/ProjectService.cpp
    src/services/NotificationService.cpp
    src/database/Database.cpp
    src/database/UserRepository.cpp
    src/database/TaskRepository.cpp
    src/database/ProjectRepository.cpp
    src/auth/AuthManager.cpp
    src/auth/Session.cpp
    src/api/UserController.cpp
    src/api/TaskController.cpp
    src/api/ProjectController.cpp
    src/validation/Validator.cpp
    src/validation/UserValidator.cpp
    src/validation/TaskValidator.cpp
)

# Include directories
target_include_directories(taskmanager PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

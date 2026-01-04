# My C++ Application

A simple C++ application demonstrating package visualization with namespaces, classes, and dependencies.

## Structure

- `src/` - Source files (.cpp)
- `include/` - Header files (.h, .hpp)
- `CMakeLists.txt` - CMake build configuration

## Components

- **utils::Calculator** - Basic arithmetic operations
- **models::User** - User data model
- **services::UserService** - User management service

## Building

```bash
mkdir build
cd build
cmake ..
make
./myapp

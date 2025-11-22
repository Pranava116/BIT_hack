cmake_minimum_required(VERSION 3.18)
project("myapp")

# Use C++17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add C++ source files
add_library(
    native-lib
    SHARED
    NativeProxy.cpp
)

# Include paths (React Native headers, fbjni)
include_directories(
    ${CMAKE_SOURCE_DIR}/../react-native-screens/cpp
    ${CMAKE_SOURCE_DIR}/../../../../node_modules/react-native/ReactCommon
    ${CMAKE_SOURCE_DIR}/../../../../node_modules/fbjni/include
)

# Link libraries
target_link_libraries(
    native-lib
    android
    log
    c++_shared
)

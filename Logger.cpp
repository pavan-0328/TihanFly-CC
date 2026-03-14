#include "Logger.h"
#include <iostream>
#include <chrono>
#include <ctime>

Logger& Logger::getInstance()
{
    static Logger instance;
    return instance;
}

Logger::Logger()
{
    // Open three separate log files
    debugFile.open("debug.txt", std::ios::app);
    warningFile.open("warning.txt", std::ios::app);
    errorFile.open("error.txt", std::ios::app);

    if (!debugFile.is_open()) std::cerr << "Failed to open debug.log\n";
    if (!warningFile.is_open()) std::cerr << "Failed to open warning.log\n";
    if (!errorFile.is_open()) std::cerr << "Failed to open error.log\n";
}

Logger::~Logger()
{
    if (debugFile.is_open()) debugFile.close();
    if (warningFile.is_open()) warningFile.close();
    if (errorFile.is_open()) errorFile.close();
}

void Logger::logDebug(const std::string& sender, const std::string& message)
{
    log(LogLevel::DEBUG, sender, message);
}

void Logger::logWarning(const std::string& sender, const std::string& message)
{
    log(LogLevel::WARNING, sender, message);
}

void Logger::logError(const std::string& sender, const std::string& message)
{
    log(LogLevel::ERROR, sender, message);
}

void Logger::log(LogLevel level, const std::string& sender, const std::string& message)
{
    std::lock_guard<std::mutex> lock(logMutex);

    auto now = std::chrono::system_clock::now();
    std::time_t now_time = std::chrono::system_clock::to_time_t(now);
    std::string timestamp = std::ctime(&now_time);
    if (!timestamp.empty() && timestamp.back() == '\n') timestamp.pop_back();

    std::ofstream* targetFile = nullptr;

    switch(level)
    {
        case LogLevel::DEBUG:   targetFile = &debugFile; break;
        case LogLevel::WARNING: targetFile = &warningFile; break;
        case LogLevel::ERROR:   targetFile = &errorFile; break;
    }

    if (targetFile && targetFile->is_open())
    {
        *targetFile << "[" << levelToString(level) << "][" << sender << "] "
                    << message << " (" << timestamp << ")" << std::endl;
        targetFile->flush();
    }
}

std::string Logger::levelToString(LogLevel level)
{
    switch(level)
    {
        case LogLevel::DEBUG:   return "DEBUG";
        case LogLevel::WARNING: return "WARNING";
        case LogLevel::ERROR:   return "ERROR";
        default: return "UNKNOWN";
    }
}

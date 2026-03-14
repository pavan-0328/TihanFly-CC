#ifndef LOGGER_H
#define LOGGER_H

#include <string>
#include <mutex>
#include <fstream>

class Logger
{
public:
    enum class LogLevel
    {
        DEBUG,
        WARNING,
        ERROR
    };

    static Logger& getInstance();

    void logDebug(const std::string& sender, const std::string& message);
    void logWarning(const std::string& sender, const std::string& message);
    void logError(const std::string& sender, const std::string& message);

private:
    Logger();  
    ~Logger();

    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;

    void log(LogLevel level, const std::string& sender, const std::string& message);
    std::string levelToString(LogLevel level);

    std::mutex logMutex;

    std::ofstream debugFile;
    std::ofstream warningFile;
    std::ofstream errorFile;
};

#endif // LOGGER_H

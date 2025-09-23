/**
 * Simple logging utility for the application
 * In production, this could be extended to use a more sophisticated logging service
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.ERROR;

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (level >= this.level) {
      const timestamp = new Date().toISOString();
      const levelName = LogLevel[level];

      switch (level) {
        case LogLevel.ERROR:
          console.error(`[${timestamp}] ${levelName}:`, message, ...args);
          break;
        case LogLevel.WARN:
          console.warn(`[${timestamp}] ${levelName}:`, message, ...args);
          break;
        case LogLevel.INFO:
          console.info(`[${timestamp}] ${levelName}:`, message, ...args);
          break;
        case LogLevel.DEBUG:
          console.log(`[${timestamp}] ${levelName}:`, message, ...args);
          break;
      }
    }
  }

  debug(message: string, ...args: any[]) {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log(LogLevel.INFO, message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log(LogLevel.WARN, message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log(LogLevel.ERROR, message, ...args);
  }
}

export const logger = new Logger();
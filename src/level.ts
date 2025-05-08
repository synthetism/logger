/**
 * Standard log levels
 */
export enum LogLevel {
  /**
   * Debug messages - detailed info for debugging
   */
  DEBUG = 'debug',
  
  /**
   * Informational messages - application progress
   */
  INFO = 'info',
  
  /**
   * Warning messages - potential issues
   */
  WARN = 'warn',
  
  /**
   * Error messages - issues that should be addressed
   */
  ERROR = 'error',
  
  /**
   * No logging output
   */
  SILENT = 'silent'
}

/**
 * Maps log levels to numeric values for comparison
 * Higher number = more severe
 */
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.SILENT]: 4
};

/**
 * Check if a given level should be logged at the current minimum level
 */
export function shouldLog(currentLevel: LogLevel, minimumLevel: LogLevel): boolean {
  return LOG_LEVEL_VALUES[currentLevel] >= LOG_LEVEL_VALUES[minimumLevel];
}
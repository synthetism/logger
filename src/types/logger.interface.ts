import type { LogLevel } from "./level";
import type { EventChannel } from "./event-channel.interface";
/**
 * Core logger interface shared across Synet packages
 */
export interface Logger {
  /**
   * Log a debug message
   * @param message The message to log
   * @param args Additional arguments to log
   */
  debug(message: string, ...args: unknown[]): void;

  /**
   * Log an info message
   * @param message The message to log
   * @param args Additional arguments to log
   */
  info(message: string, ...args: unknown[]): void;

  /**
   * Log a warning message
   * @param message The message to log
   * @param args Additional arguments to log
   */
  warn(message: string, ...args: unknown[]): void;

  /**
   * Log an error message
   * @param message The message to log
   * @param args Additional arguments to log (can include Error objects)
   */
  error(message: string, ...args: unknown[]): void;

  /**
   * Log a message at the specified level
   * @param level The log level
   * @param message The message to log
   * @param args Additional arguments to log
   */
  log(level: LogLevel, message: string, ...args: unknown[]): void;

  /**
   * Create a child logger with a specific context
   * @param context The context for the child logger
   * @returns A new logger instance with the specified context
   */
  child(context: string): Logger;
}

/**
 * Configuration options for logger creation
 */
export interface LoggerOptions {
  /**
   * The minimum log level to output
   * @default LogLevel.INFO
   */
  level?: LogLevel;

  /**
   * The context name for the logger
   * @default 'Synet'
   */
  context?: string;

  /**
   * Whether to include timestamps in log messages
   * @default true
   */
  timestamp?: boolean;

  /**
   * Custom formatting options
   */
  formatting?: {
    /**
     * Whether to colorize output (for supported adapters)
     * @default true
     */
    colorize?: boolean;

    /**
     * Date format for timestamps (if enabled)
     * @default 'ISO' ('YYYY-MM-DDTHH:mm:ss.sssZ')
     */
    dateFormat?: "ISO" | "locale" | "epoch";
  };

  /**
   * Array of loggers for MultiLogger
   * Required if using MultiLogger
   */
  loggers?: Logger[];
}

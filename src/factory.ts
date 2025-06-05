import type { Logger, LoggerOptions } from "./logger.interface";
import { ConsoleLogger } from "./adapters/console-logger";
import { NullLogger } from "./adapters/null-logger";
import { LogLevel } from "./level";

/**
 * Available logger types
 * CONSOLE: Logs to the console
 * NULL: Discards all log messages (no output)
 */
export enum LoggerType {
  CONSOLE = "console",
  NULL = "null",
}

/**
 * Create a logger instance
 * @param type The type of logger to create
 * @param options Configuration options
 * @returns A configured logger instance
 */
export function createLogger(
  type: LoggerType = LoggerType.CONSOLE,
  options: LoggerOptions = {},
): Logger {
  switch (type) {
    case LoggerType.CONSOLE:
      return new ConsoleLogger(options);
    case LoggerType.NULL:
      return new NullLogger();
    default:
      console.warn(`Unknown logger type: ${type}, using ConsoleLogger`);
      return new ConsoleLogger(options);
  }
}

/**
 * Default root logger instance - reuse this when possible
 */
export const rootLogger = createLogger(LoggerType.CONSOLE, {
  level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
  context: "Synet",
});

/**
 * Default root logger instance - reuse this when possible
 */
export const nullLogger = createLogger(LoggerType.NULL, {
  level: LogLevel.SILENT,
  context: "Synet",
});

/**
 * Get a child logger from the root logger
 * @param context The context for the child logger
 * @returns A child logger
 */
export function getLogger(context: string): Logger {
  return rootLogger.child(context);
}

/**
 * Get a child logger from the null logger
 * @param context The context for the child logger
 * @returns A child logger
 */
export function getNull(context: string): Logger {
  return nullLogger.child(context);
}
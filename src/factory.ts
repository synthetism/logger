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
 * Singleton instances for reuse
 */
const loggerInstances = {
  root: createLogger(LoggerType.CONSOLE, {
    level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
    context: "Synet",
  }),
  null: new NullLogger(),
};

/**
 * Get a logger with the specified context
 * 
 * @param context The context for the logger (e.g. "KeyService", "Network")
 * @param type Optional logger type, defaults to the one specified in environment
 * @returns A logger with the specified context
 */
export function getLogger(
  context: string, 
  type?: LoggerType
): Logger {
  // If type is explicitly specified, create a new logger of that type
  if (type !== undefined) {
    return createLogger(type, { context });
  }
  
  // Use NULL logger if LOG_SILENT env var is truthy
  if (process.env.LOG_SILENT === "true" || process.env.LOG_SILENT === "1") {
    return loggerInstances.null;
  }
  
  // Otherwise use the root logger with the provided context
  return loggerInstances.root.child(context);
}

/**
 * Get a logger that discards all messages
 * @param context Optional context for the null logger
 * @returns A null logger that discards all messages
 */
export function getNullLogger(context?: string): Logger {
  return context ? loggerInstances.null.child(context) : loggerInstances.null;
}

/**
 * Convenience export for the null logger singleton
 */
export const nullLogger = loggerInstances.null;
import {
  ConsoleLogger,
  EventLogger,
  MultiLogger,
  NullLogger,
} from "./adapters";
import type { LoggerOptions } from "./types/logger.interface";
import type { EventChannel } from "./types/event-channel.interface";
import type { EventLoggerOptions } from "./adapters/event-logger";
import { LogLevel } from "./types/level";
import { Logger } from "./logger.unit";
import type { LoggerEvent } from "./types/logger-events";
/**
 * Available logger types
 * CONSOLE: Logs to the console
 * NULL: Discards all log messages (no output)
 * EVENT: Sends logs to an EventChannel
 * MULTI: Combines multiple loggers into one
 */

export enum LoggerType {
  CONSOLE = "console",
  NULL = "null",
  EVENT = "event",
  MULTI = "multi",
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
      return Logger.create({ type: LoggerType.CONSOLE, options });
    case LoggerType.NULL:
      return  Logger.create({ type: LoggerType.NULL, options });
    case LoggerType.MULTI:

      if (!options.loggers || !Array.isArray(options.loggers)) {
        throw new Error("Loggers array is required for MultiLogger");
      }
      return Logger.create({ type: LoggerType.MULTI, options: {
          loggers : options.loggers
      } });
    default:
      console.warn(`Unknown logger type: ${type}, using ConsoleLogger`);
      return Logger.create({ type: LoggerType.CONSOLE, options });
  }
}

/**
 * Creates an EventLogger that sends logs to an EventChannel
 */
export function createEventLogger<T>(
  eventChannel: EventChannel<LoggerEvent>,
  options: EventLoggerOptions = {},
): Logger {
  return Logger.create({ type: LoggerType.EVENT, options: {
      eventChannel,
      ...options
  } });
}

/**
 * Creates a MultiLogger that sends logs to multiple destinations
 */
export function createMultiLogger(loggers: Logger[]): Logger {
  return Logger.create({ type: LoggerType.MULTI, options: {
      loggers
  } });
}

/**
 * Singleton instances for reuse
 */
const loggerInstances = {
  root: Logger.create({
    type: LoggerType.CONSOLE, options: {
      level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
      context: "Logger",
    }
  }) as Logger,
  null: Logger.create({ type: LoggerType.NULL }) as Logger,
};

/**
 * Get a logger with the specified context
 *
 * @param context The context for the logger (e.g. "KeyService", "Network")
 * @param type Optional logger type, defaults to the one specified in environment
 * @returns A logger with the specified context
 */
export function getLogger(context: string, type?: LoggerType): Logger {
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
export function getNullLogger(): Logger {
  return loggerInstances.null;
}

/**
 * Convenience export for the null logger singleton
 */
export const nullLogger = loggerInstances.null;

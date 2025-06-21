import {
  ConsoleLogger,
  EventLogger,
  MultiLogger,
  NullLogger,
} from "./adapters";
import type { Logger, LoggerOptions } from "./types/logger.interface";
import type { EventChannel } from "./types/event-channel.interface";
import type { EventLoggerOptions } from "./adapters/event-logger";
import { LogLevel } from "./types/level";
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
      return new ConsoleLogger(options);
    case LoggerType.NULL:
      return new NullLogger();
    case LoggerType.EVENT:
      if (!options.eventChannel) {
        throw new Error("EventChannel is required for EventLogger");
      }
      return new EventLogger(
        options.eventChannel as EventChannel,
        options as EventLoggerOptions,
      );
    case LoggerType.MULTI:
      if (!options.loggers || !Array.isArray(options.loggers)) {
        throw new Error("Loggers array is required for MultiLogger");
      }
      return new MultiLogger(options.loggers as Logger[]);
    default:
      console.warn(`Unknown logger type: ${type}, using ConsoleLogger`);
      return new ConsoleLogger(options);
  }
}

/**
 * Creates an EventLogger that sends logs to an EventChannel
 */
export function createEventLogger(
  eventChannel: EventChannel,
  options: EventLoggerOptions = {},
): Logger {
  return new EventLogger(eventChannel, options);
}

/**
 * Creates a MultiLogger that sends logs to multiple destinations
 */
export function createMultiLogger(loggers: Logger[]): Logger {
  return new MultiLogger(loggers);
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
export function getNullLogger(context?: string): Logger {
  return context ? loggerInstances.null.child(context) : loggerInstances.null;
}

/**
 * Convenience export for the null logger singleton
 */
export const nullLogger = loggerInstances.null;

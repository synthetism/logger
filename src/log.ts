/**
 * LOG - Clean Factory for Logger Units
 *
 * Provides a clean, organized way to create logger units following
 * the established FS pattern for SYNET.
 *
 * Usage:
 * ```typescript
 * // Simple console logging
 * const log = LOG.console({ level: 'debug', context: 'MyApp' });
 * log.info('Application started');
 *
 * // File logging with rotation
 * const fileLog = LOG.file({ filePath: './logs/app.log', maxSize: 1024*1024 });
 * 
 * // Remote logging via events
 * const remoteLog = LOG.remote(eventChannel, { context: 'Production' });
 * 
 * // Silent logging for tests
 * const testLog = LOG.null();
 * ```
 */

import { Logger } from "./logger.unit";
import type { LoggerOptions } from "./types/logger.interface";
import type { FileLoggerOptions } from "./adapters/file-logger";
import type { EventLoggerOptions } from "./adapters/event-logger";
import type { EventChannel } from "./types/event-channel.interface";
import type { LoggerEvent } from "./types/logger-events";
import type { ILogger } from "./types/logger.interface";
import { LogLevel } from "./types/level";

/**
 * Clean logger factory with intuitive method names
 */
export const LOG = {
  /**
   * Console logger - outputs to stdout/stderr with colors and formatting
   * @param options Console logger configuration
   */
  console: (options: LoggerOptions = {}) =>
    Logger.create({
      type: "console",
      options,
    }),

  /**
   * File logger - outputs to rotating log files
   * @param options File logger configuration including file path and rotation
   */
  file: (options: FileLoggerOptions) =>
    Logger.create({
      type: "file",
      options,
    }),

  /**
   * Event logger - emits log events to a provided event channel
   * @param options Event logger configuration with event channel
   */
  event: (options: EventLoggerOptions & { eventChannel: EventChannel<LoggerEvent> }) =>
    Logger.create({
      type: "event",
      options,
    }),

  /**
   * Null logger - discards all log messages (useful for testing/production)
   * @param options Basic logger configuration (mostly ignored)
   */
  null: (options: LoggerOptions = {}) =>
    Logger.create({
      type: "null",
      options,
    }),

  /**
   * Multi logger - sends logs to multiple logger instances
   * @param loggers Array of logger instances to send logs to
   * @param options Basic logger configuration
   */
  multi: (loggers: ILogger[], options: LoggerOptions = {}) =>
    Logger.create({
      type: "multi",
      options: { ...options, loggers },
    }),
};

// Re-export the core Logger unit for direct usage if needed
export { Logger };

// Re-export all types for convenience
export type {
  LoggerBackendType,
  LoggerBackendOptions,
  LoggerConfig
} from "./logger.unit";

/**
 * Legacy compatibility - will be deprecated
 * @deprecated Use LOG.console, LOG.file, etc. instead
 */
export const LogFactory = {
  console: LOG.console,
  file: LOG.file,
  null: LOG.null,
};

import type { ILogger, LoggerOptions } from "../types/logger.interface";
import type { LogLevel } from "../types/level";

/**
 * A no-op logger implementation that does nothing
 * Useful for testing or disabling logging
 */
export class NullLogger implements ILogger {
  debug(_message: string, ..._args: unknown[]): void {}
  info(_message: string, ..._args: unknown[]): void {}
  warn(_message: string, ..._args: unknown[]): void {}
  error(_message: string, ..._args: unknown[]): void {}
  log(_level: LogLevel, _message: string, ..._args: unknown[]): void {}

  child(_context: string): ILogger {
    return this; // Return same instance as child loggers also do nothing
  }
}

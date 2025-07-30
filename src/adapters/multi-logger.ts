import type { ILogger, LoggerOptions } from "../types/logger.interface";
import type { LogLevel } from "../types/level";

/**
 * Logger implementation that sends logs to multiple targets
 */
export class MultiLogger implements ILogger {
  /**
   * Create a new MultiLogger that sends logs to multiple targets
   * @param loggers Array of loggers to send logs to
   */
  constructor(private loggers: ILogger[]) {}

  debug(message: string, ...args: unknown[]): void {
    for (const logger of this.loggers) {
      logger.debug(message, ...args);
    }
  }
  info(message: string, ...args: unknown[]): void {
    for (const logger of this.loggers) {
      logger.info(message, ...args);
    }
  }
  warn(message: string, ...args: unknown[]): void {
    for (const logger of this.loggers) {
      logger.warn(message, ...args);
    }
  }
  error(message: string, ...args: unknown[]): void {
    for (const logger of this.loggers) {
      logger.error(message, ...args);
    }
  }
  log(level: LogLevel, message: string, ...args: unknown[]): void {
    for (const logger of this.loggers) {
      logger.log(level, message, ...args);
    }
  }

  /**
   * Create a child logger with a new context
   */
  child(context: string): ILogger {
    // Create child loggers from each source logger
    const childLoggers = this.loggers.map((logger) => logger.child(context));
    return new MultiLogger(childLoggers);
  }
}

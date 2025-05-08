import { Logger, LoggerOptions } from './logger.interface';
import { ConsoleLogger } from './adapters/console-logger';
import { NullLogger } from './adapters/null-logger';
import { LogLevel } from './level';

/**
 * Available logger types
 */
export enum LoggerType {
  CONSOLE = 'console',
  NULL = 'null'
}

/**
 * Create a logger instance
 * @param type The type of logger to create
 * @param options Configuration options
 * @returns A configured logger instance
 */
export function createLogger(
  type: LoggerType = LoggerType.CONSOLE,
  options: LoggerOptions = {}
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
  context: 'Synet'
});

/**
 * Get a child logger from the root logger
 * @param context The context for the child logger
 * @returns A child logger
 */
export function getLogger(context: string): Logger {
  return rootLogger.child(context);
}
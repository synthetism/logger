import { Logger } from '../logger.interface';
import { LogLevel } from '../level';

/**
 * A no-op logger implementation that does nothing
 * Useful for testing or disabling logging
 */
export class NullLogger implements Logger {
  debug(_message: string, ..._args: any[]): void {}
  info(_message: string, ..._args: any[]): void {}
  warn(_message: string, ..._args: any[]): void {}
  error(_message: string, ..._args: any[]): void {}
  log(_level: LogLevel, _message: string, ..._args: any[]): void {}
  
  child(_context: string): Logger {
    return this; // Return same instance as child loggers also do nothing
  }
}
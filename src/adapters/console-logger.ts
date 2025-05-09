import type { Logger, LoggerOptions } from "../logger.interface";

import { LogLevel, shouldLog } from "../level";

/**
 * A console-based implementation of the Logger interface
 */
export class ConsoleLogger implements Logger {
  private readonly options: Required<LoggerOptions>;

  /**
   * Create a new ConsoleLogger
   * @param options Configuration options
   */
  constructor(options: LoggerOptions = {}) {
    // Set default options
    this.options = {
      level: options.level || LogLevel.INFO,
      context: options.context || "Synet",
      timestamp: options.timestamp !== undefined ? options.timestamp : true,
      formatting: {
        colorize:
          options.formatting?.colorize !== undefined
            ? options.formatting.colorize
            : true,
        dateFormat: options.formatting?.dateFormat || "ISO",
      },
    };
  }

  /**
   * Format the timestamp based on the configured format
   */
  private getTimestamp(): string {
    if (!this.options.timestamp) {
      return "";
    }

    const now = new Date();
    switch (this.options.formatting.dateFormat) {
      case "ISO":
        return now.toISOString();
      case "locale":
        return now.toLocaleString();
      case "epoch":
        return now.getTime().toString();
      default:
        return now.toISOString();
    }
  }

  /**
   * Apply color to a string (if colorization is enabled)
   */
  private colorize(text: string, level: LogLevel): string {
    if (!this.options.formatting.colorize) {
      return text;
    }

    // ANSI color codes
    const colors = {
      reset: "\x1b[0m",
      debug: "\x1b[90m", // Gray
      info: "\x1b[36m", // Cyan
      warn: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
    };

    // Only colorize if we have a color for this level
    const color = colors[level as keyof typeof colors] || "";
    return color ? `${color}${text}${colors.reset}` : text;
  }

  /**
   * Format and write a log message
   */
  log(level: LogLevel, message: string, ...args: unknown[]): void {
    // Check if this level should be logged
    if (!shouldLog(level, this.options.level)) {
      return;
    }

    // Build log parts
    const parts = [];

    // Add timestamp if enabled
    const timestamp = this.getTimestamp();
    if (timestamp) {
      parts.push(`[${timestamp}]`);
    }

    // Add level and context
    parts.push(`[${level.toUpperCase()}]`);
    parts.push(`[${this.options.context}]`);

    // Combine into final message
    const logPrefix = parts.join(" ");
    const formattedPrefix = this.colorize(logPrefix, level);

    // Use appropriate console method for the level
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedPrefix, message, ...args);
        break;
      case LogLevel.INFO:
        console.info(formattedPrefix, message, ...args);
        break;
      case LogLevel.WARN:
        console.warn(formattedPrefix, message, ...args);
        break;
      case LogLevel.ERROR:
        console.error(formattedPrefix, message, ...args);
        break;
      default:
        console.log(formattedPrefix, message, ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  /**
   * Create a child logger with a new context
   */
  child(context: string): Logger {
    return new ConsoleLogger({
      ...this.options,
      context: `${this.options.context}:${context}`,
    });
  }
}

import type { Logger, LoggerOptions } from "../types/logger.interface";
import { LogLevel, shouldLog } from "../types/level";
import { formatMessage } from "../utils/format-message";
import { stripAnsiColorCodes } from "../utils/ansi-colors";
/**
 * A console-based implementation of the Logger interface
 */
export class ConsoleLogger implements Logger {
  private readonly options: Required<
    Omit<LoggerOptions, "eventChannel" | "loggers" | "channelName">
  >;

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
   * Strip colors from an object or value after the log message is formatted
   */
  private stripColorsFromArgs(value: unknown): unknown {
    if (value === null || value === undefined) {
      return value;
    }

    console.log("Stripping ANSI color codes from:", value);

    if (typeof value === "string") {
      return stripAnsiColorCodes(value);
    }

    if (typeof value !== "object") {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.stripColorsFromArgs(item));
    }

    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = this.stripColorsFromArgs(val);
    }
    return result;
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

    // Process template placeholders if first arg is an object
    let formattedMessage = message;
    const processedArgs = [...args];

    if (
      args.length > 0 &&
      typeof args[0] === "object" &&
      args[0] !== null &&
      !(args[0] instanceof Error)
    ) {
      // Use the first argument as context for template processing
      formattedMessage = formatMessage(
        message,
        args[0] as Record<string, unknown>,
      );
    }

    const strippedArgs = processedArgs.map((arg) =>
      this.stripColorsFromArgs(arg),
    );

    type ConsoleMethods = "debug" | "info" | "warn" | "error" | "log";
    const methodMap: Record<LogLevel, ConsoleMethods> = {
      debug: "debug",
      info: "info",
      warn: "warn",
      error: "error",
      silent: "log",
    };

    const consoleMethod = methodMap[level] || "log";
    console[consoleMethod](formattedPrefix, formattedMessage, ...strippedArgs);
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

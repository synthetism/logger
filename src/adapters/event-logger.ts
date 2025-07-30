import type { ILogger, LoggerOptions } from "../types/logger.interface";
import { LogLevel, shouldLog } from "../types/level";
import { formatMessage } from "../utils/format-message";
import type { EventChannel } from "../types/event-channel.interface";
import type { LoggerEvent } from "../types/logger-events";
import {
  stripColorsFromArgs,
  stripAnsiColorCodes,
} from "../utils/strip-colors";
export interface EventLoggerOptions extends LoggerOptions {
  /** The channel name to publish logs to */
}

/**
 * A logger implementation that publishes logs to an EventChannel
 * This can be used to send logs to remote systems
 */
export class EventLogger implements ILogger {
  private readonly options: Required<Omit<EventLoggerOptions, "loggers">>;

  constructor(
    private readonly eventChannel: EventChannel<LoggerEvent>,
    options: EventLoggerOptions = {},
  ) {
    this.options = {
      level: options.level || LogLevel.INFO,
      context: options.context || "Logger",
      timestamp: options.timestamp !== undefined ? options.timestamp : true,
      formatting: {
        colorize: false, // Colors don't make sense for remote logging
        dateFormat: options.formatting?.dateFormat || "ISO",
      },
    };
  }

  /**
   * Publishes a log event to the event channel
   */
  async log(
    level: LogLevel,
    message: string,
    ...args: unknown[]
  ): Promise<void> {
    // Check if this level should be logged
    if (!shouldLog(level, this.options.level)) {
      return;
    }

    // Process template placeholders if first arg is an object
    let formattedMessage = message;
    const processedArgs = [...args];

    if (args.length > 0 && typeof args[0] === "object" && args[0] !== null) {
      // Use the first argument as context for template processing
      formattedMessage = formatMessage(
        message,
        args[0] as Record<string, unknown>,
      );
    }

    const strippedArgs = stripColorsFromArgs(processedArgs);

    try {
      // Create the log event
      const logEvent = {
        id: crypto.randomUUID(),
        type: `logger.${level}`,
        source: this.options.context,
        timestamp: new Date(),
        data: {
          level: level,
          message: formattedMessage,
          args: strippedArgs,
        },
      } as LoggerEvent;

      // Send to the event channel
      await this.eventChannel.publish(logEvent);
    } catch (error) {
      // Don't let logging errors cause application failures
      console.error(`Failed to publish log event: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.log(LogLevel.DEBUG, message, ...args).catch(() => {
      // Silent catch - already logged error in the log method
    });
  }

  info(message: string, ...args: unknown[]): void {
    this.log(LogLevel.INFO, message, ...args).catch(() => {
      // Silent catch - already logged error in the log method
    });
  }

  warn(message: string, ...args: unknown[]): void {
    this.log(LogLevel.WARN, message, ...args).catch(() => {
      // Silent catch - already logged error in the log method
    });
  }

  error(message: string, ...args: unknown[]): void {
    this.log(LogLevel.ERROR, message, ...args).catch(() => {
      // Silent catch - already logged error in the log method
    });
  }

  /**
   * Create a child logger with a new context
   */
  child(context: string): ILogger {
    return new EventLogger(this.eventChannel, {
      ...this.options,
      context: `${this.options.context}:${context}`,
    });
  }

  /**
   * Strip colors from any value, recursively traversing objects
   */
  private stripColorsDeep(value: unknown): unknown {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === "string") {
      return stripAnsiColorCodes(value);
    }

    if (typeof value !== "object") {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.stripColorsDeep(item));
    }

    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = this.stripColorsDeep(val);
    }
    return result;
  }
}

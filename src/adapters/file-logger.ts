import * as fs from "node:fs";
import * as path from "node:path";
import type { ILogger, LoggerOptions } from "../types/logger.interface";
import { LogLevel, shouldLog } from "../types/level";
import { formatMessage } from "../utils/format-message";
import {
  stripColorsFromArgs,
  stripAnsiColorCodes,
} from "../utils/strip-colors";

export interface FileLoggerOptions extends LoggerOptions {
  /**
   * Path to the log file
   * @default "logs/app.log"
   */
  filePath?: string;

  /**
   * Whether to append to existing log file
   * @default true
   */
  append?: boolean;

  /**
   * Maximum file size in bytes before rotation
   * @default 10485760 (10MB)
   */
  maxSize?: number;

  /**
   * How many rotated files to keep
   * @default 5
   */
  maxFiles?: number;
}

/**
 * A logger implementation that writes to a file
 */
export class FileLogger implements ILogger {
  private readonly options: Required<
    Omit<FileLoggerOptions, "eventChannel" | "loggers" | "channelName">
  >;
  private writeStream: fs.WriteStream | null = null;
  private currentSize = 0;
  private fileNumber = 0;

  constructor(options: FileLoggerOptions = {}) {
    this.options = {
      level: options.level || LogLevel.INFO,
      context: options.context || "Synet",
      timestamp: options.timestamp !== undefined ? options.timestamp : true,
      formatting: {
        colorize: false, // Colors don't make sense in files
        dateFormat: options.formatting?.dateFormat || "ISO",
      },
      filePath: options.filePath || "logs/app.log",
      append: options.append !== undefined ? options.append : true,
      maxSize: options.maxSize || 10 * 1024 * 1024, // 10MB
      maxFiles: options.maxFiles || 5,
    };

    // Ensure directory exists
    const dir = path.dirname(this.options.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.initializeWriteStream();
  }

  private initializeWriteStream(): void {
    const { filePath, append } = this.options;

    // Get file size if it exists
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      this.currentSize = stats.size;
    } else {
      this.currentSize = 0;
    }

    this.writeStream = fs.createWriteStream(filePath, {
      flags: append ? "a" : "w",
      encoding: "utf8",
    });

    this.writeStream.on("error", (err) => {
      console.error(`Error writing to log file: ${err.message}`);
    });
  }

  private async rotateLogFile(): Promise<void> {
    if (!this.writeStream) return;

    // Close current stream
    this.writeStream.end();
    this.writeStream = null;

    // Rotate files
    for (let i = this.options.maxFiles - 1; i >= 0; i--) {
      const source =
        i === 0 ? this.options.filePath : `${this.options.filePath}.${i}`;

      const target = `${this.options.filePath}.${i + 1}`;

      if (fs.existsSync(source)) {
        try {
          if (fs.existsSync(target)) {
            fs.unlinkSync(target);
          }
          fs.renameSync(source, target);
        } catch (err) {
          console.error(`Error rotating log files: ${(err as Error).message}`);
        }
      }
    }

    // Create new write stream
    this.initializeWriteStream();
  }

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

  async log(
    level: LogLevel,
    message: string,
    ...args: unknown[]
  ): Promise<void> {
    // Check if this level should be logged
    if (!shouldLog(level, this.options.level) || !this.writeStream) {
      return;
    }

    // Build log parts
    const parts: string[] = [];

    // Add timestamp if enabled
    const timestamp = this.getTimestamp();
    if (timestamp) {
      parts.push(`[${timestamp}]`);
    }

    // Add level and context
    parts.push(`[${level.toUpperCase()}]`);
    parts.push(`[${this.options.context}]`);

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

    // Prepare log entry
    const logPrefix = parts.join(" ");
    let logEntry = `${logPrefix} ${formattedMessage}`;

    const strippedArgs = stripColorsFromArgs(processedArgs);

    // Add remaining args as JSON
    if (processedArgs.length > 0) {
      try {
        logEntry += `  ${JSON.stringify(strippedArgs)};`;
      } catch {
        logEntry += " [Arguments could not be serialized]";
      }
    }

    // Add newline
    logEntry += "\n";

    // Check if rotation is needed
    if (this.currentSize + logEntry.length > this.options.maxSize) {
      await this.rotateLogFile();
    }

    // Write to file
    if (this.writeStream) {
      this.writeStream.write(logEntry);
      this.currentSize += logEntry.length;
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.log(LogLevel.DEBUG, message, ...args).catch(() => {
      // Silent catch
    });
  }

  info(message: string, ...args: unknown[]): void {
    this.log(LogLevel.INFO, message, ...args).catch(() => {
      // Silent catch
    });
  }

  warn(message: string, ...args: unknown[]): void {
    this.log(LogLevel.WARN, message, ...args).catch(() => {
      // Silent catch
    });
  }

  error(message: string, ...args: unknown[]): void {
    this.log(LogLevel.ERROR, message, ...args).catch(() => {
      // Silent catch
    });
  }

  /**
   * Create a child logger with a new context
   */
  child(context: string): ILogger {
    return new FileLogger({
      ...this.options,
      context: `${this.options.context}:${context}`,
    });
  }

  /**
   * Close the file stream
   */
  async close(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.writeStream) {
        resolve();
        return;
      }

      this.writeStream.end(() => {
        this.writeStream = null;
        resolve();
      });
    });
  }
}

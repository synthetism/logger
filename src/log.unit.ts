/**
 * Log Unit - Cross-platform logging with Unit Architecture consciousness
 *
 * Simple use cases:
 * 1. Structured logging with context
 * 2. Multi-adapter logging (console, file, remote)
 * 3. Teaching/learning logging capabilities
 * 4. Cross-unit audit trails
 * 
 * Design principles:
 * - Unit -> Backend -> Adapters pattern
 * - Teaching/learning contracts for capability sharing
 * - Enhanced error messages with Unit identity
 * - Immutable evolution (returns new instances)
 */

import {
  type TeachingContract,
  Unit,
  type UnitProps,
  UnitSchema,
  createUnitSchema,
} from "@synet/unit";
import type { Logger, LoggerOptions } from "./types/logger.interface";
import type { LogLevel } from "./types/level";
import { 
  ConsoleLogger,
  FileLogger,
  EventLogger,
  MultiLogger,
  NullLogger
} from "./adapters";
import type { EventChannel } from "./types/event-channel.interface";
import type { LoggerEvent } from "./types/logger-events";
import type { EventLoggerOptions } from "./adapters/event-logger";
import type { FileLoggerOptions } from "./adapters/file-logger";

/**
 * Supported logger backend types
 */
export type LoggerBackendType = 
  | "console"
  | "file" 
  | "event"
  | "multi"
  | "null";

/**
 * Options for different logger backends
 */
export type LoggerBackendOptions = {
  console: LoggerOptions;
  file: FileLoggerOptions;
  event: EventLoggerOptions & { eventChannel: EventChannel<LoggerEvent> };
  multi: LoggerOptions & { loggers: Logger[] };
  null: LoggerOptions;
};

/**
 * Logger creation configuration
 */
export interface LoggerConfig<T extends LoggerBackendType = LoggerBackendType> {
  type: T;
  options?: LoggerBackendOptions[T];
}

/**
 * Log Unit properties following Unit Architecture
 */
interface LogProps extends UnitProps {
  backend: Logger;
  config: LoggerConfig;
  stats: {
    messages: number;
    errors: number;
    contexts: Set<string>;
  };
}

/**
 * Log Unit - Conscious logging with teaching/learning capabilities
 * 
 * Wraps existing Logger adapters in Unit Architecture for:
 * - Teaching logging capabilities to other units
 * - Learning enhanced logging from specialized units
 * - Cross-unit audit trails and identity tracking
 * - Enhanced error messages with Unit context
 */
export class Log extends Unit<LogProps> implements Logger {
  protected constructor(props: LogProps) {
    super(props);
  }

  /**
   * CREATE - Create a new Log Unit
   */
  static create<T extends LoggerBackendType>(
    config: LoggerConfig<T>
  ): Log {
    const backend = Log.createBackend(config);

    const props: LogProps = {
      dna: createUnitSchema({
        id: "log",
        version: "1.0.0",
      }),
      backend,
      config,
      stats: {
        messages: 0,
        errors: 0,
        contexts: new Set(),
      },
      created: new Date(),
    };

    return new Log(props);
  }

  // ==========================================
  // LOGGER INTERFACE IMPLEMENTATION
  // ==========================================

  /**
   * Log a debug message
   */
  debug(message: string, ...args: unknown[]): void {
    this.trackMessage();
    
    // Enhanced message with Unit identity for capability-driven logging
    if (this.can('audit.enhanced')) {
      const enhancedMessage = `[${this.props.dna.id}] ${message}`;
      this.props.backend.debug(enhancedMessage, ...args);
    } else {
      this.props.backend.debug(message, ...args);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, ...args: unknown[]): void {
    this.trackMessage();
    
    if (this.can('audit.enhanced')) {
      const enhancedMessage = `[${this.props.dna.id}] ${message}`;
      this.props.backend.info(enhancedMessage, ...args);
    } else {
      this.props.backend.info(message, ...args);
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...args: unknown[]): void {
    this.trackMessage();
    
    if (this.can('audit.enhanced')) {
      const enhancedMessage = `[${this.props.dna.id}] ${message}`;
      this.props.backend.warn(enhancedMessage, ...args);
    } else {
      this.props.backend.warn(message, ...args);
    }
  }

  /**
   * Log an error message
   */
  error(message: string, ...args: unknown[]): void {
    this.trackMessage();
    this.props.stats.errors++;
    
    if (this.can('audit.enhanced')) {
      const enhancedMessage = `[${this.props.dna.id}] ${message}`;
      this.props.backend.error(enhancedMessage, ...args);
    } else {
      this.props.backend.error(message, ...args);
    }
  }

  /**
   * Log a message at the specified level
   */
  log(level: LogLevel, message: string, ...args: unknown[]): void {
    this.trackMessage();
    
    if (this.can('audit.enhanced')) {
      const enhancedMessage = `[${this.props.dna.id}] ${message}`;
      this.props.backend.log(level, enhancedMessage, ...args);
    } else {
      this.props.backend.log(level, message, ...args);
    }
  }

  /**
   * Create a child logger with a specific context
   */
  child(context: string): Logger {
    this.props.stats.contexts.add(context);
    return this.props.backend.child(context);
  }

  // ==========================================
  // UNIT CAPABILITIES (Enhanced Features)
  // ==========================================

  /**
   * TEACH - Provide logging capabilities to other units
   */
  teach(): TeachingContract {
    return {
      unitId: this.props.dna.id,
      capabilities: {
        // Native logging capabilities
        debug: (...args: unknown[]) => this.debug(args[0] as string, ...args.slice(1)),
        info: (...args: unknown[]) => this.info(args[0] as string, ...args.slice(1)),
        warn: (...args: unknown[]) => this.warn(args[0] as string, ...args.slice(1)),
        error: (...args: unknown[]) => this.error(args[0] as string, ...args.slice(1)),
        log: (...args: unknown[]) => this.log(args[0] as LogLevel, args[1] as string, ...args.slice(2)),
        child: (...args: unknown[]) => this.child(args[0] as string),               
        getBackendInfo: () => this.getBackendInfo.bind(this),
      },
    };
  }

  whoami(): string {
    return `Log[${this.props.dna.id}:${this.props.config.type}]`;
  }

  capabilities(): string[] {
    return Array.from(this._capabilities.keys());
  }


  help(): void {
    console.log(`
Log Unit - Conscious logging with Unit Architecture

Native Logger Interface:
  debug(message, ...args) - Log debug message
  info(message, ...args)  - Log info message  
  warn(message, ...args)  - Log warning message
  error(message, ...args) - Log error message
  log(level, message, ...args) - Log at specific level
  child(context) - Create child logger with context

Enhanced Unit Capabilities:
  audit.enhanced - Enhanced logging with Unit identity
  stats.get - Get logging statistics
  backend.info - Get backend information

Usage:
  const log = Log.create({ type: 'console', options: { level: 'debug' } });
  log.info('Hello from Log Unit');
  
When learned by other units:
  await otherUnit.execute('${this.props.dna.id}.info', 'Message from learned capability');
  const stats = await otherUnit.execute('${this.props.dna.id}.stats.get');
`);
  }

  // ==========================================
  // ENHANCED UNIT FEATURES
  // ==========================================

  /**
   * Enhanced audit logging with Unit identity and context
   */
  private enhancedAudit(message: string, context: unknown): void {
    const auditMessage = `[AUDIT][${this.props.dna.id}] ${message}`;
    this.props.backend.info(auditMessage, { 
      unit: this.props.dna.id,
      timestamp: new Date().toISOString(),
      context 
    });
  }

  /**
   * Get logging statistics
   */
  getStats() {
    return {
      messages: this.props.stats.messages,
      errors: this.props.stats.errors,
      contexts: Array.from(this.props.stats.contexts),
      backendType: this.props.config.type,
      errorRate: this.props.stats.messages > 0 ? this.props.stats.errors / this.props.stats.messages : 0,
    };
  }

  /**
   * Get backend information
   */
  getBackendInfo() {
    return {
      type: this.props.config.type,
      config: this.props.config.options,
      created: this.props.created,
    };
  }

  /**
   * Track message statistics
   */
  private trackMessage(): void {
    this.props.stats.messages++;
  }

  /**
   * Create a new Log unit with different backend configuration
   * Unit Architecture pattern: create new instance instead of mutation
   */
  withBackend<T extends LoggerBackendType>(
    config: LoggerConfig<T>
  ): Log {
    return Log.create(config);
  }

  /**
   * Get direct access to the underlying Logger (escape hatch)
   */
  getBackend(): Logger {
    return this.props.backend;
  }

  // ==========================================
  // BACKEND CREATION
  // ==========================================

  /**
   * Create a specific logger backend
   */
  private static createBackend<T extends LoggerBackendType>(
    config: LoggerConfig<T>
  ): Logger {
    const { type, options } = config;

    switch (type) {
      case "console":
        return new ConsoleLogger(options as LoggerOptions);

      case "file": {
        const fileOptions = options as FileLoggerOptions;
        return new FileLogger(fileOptions || {});
      }

      case "event": {
        const eventOptions = options as LoggerBackendOptions["event"];
        if (!eventOptions?.eventChannel) {
          throw new Error('[Log Unit] Event logger requires eventChannel in options');
        }
        const { eventChannel, ...loggerOptions } = eventOptions;
        return new EventLogger(eventChannel, loggerOptions);
      }

      case "multi": {
        const multiOptions = options as LoggerBackendOptions["multi"];
        if (!multiOptions?.loggers) {
          throw new Error('[Log Unit] Multi logger requires loggers array in options');
        }
        return new MultiLogger(multiOptions.loggers);
      }

      case "null":
        return new NullLogger();

      default:
        throw new Error('[Log Unit] Unsupported logger backend: ${type}');
    }
  }
}

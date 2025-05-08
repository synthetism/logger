# @synet/logger

A lightweight, flexible logging abstraction for Synet packages.

## Installation

```
npm install@synet/logger
```

## Features

* Simple, consistent logging interface across all Synet packages
* Multiple logger implementations (console, null)
* Hierarchical loggers with context inheritance
* Configurable log levels, timestamps, and formatting
* Zero dependencies

## Usage

### Basic Usage

```typescript
import { createLogger, LoggerType, LogLevel } from '@synet/logger';

// Create a console logger
const logger = createLogger(LoggerType.CONSOLE, {
  level: LogLevel.DEBUG, // Show all logs including debug
  context: 'MyApp',
  timestamp: true
});

logger.info('Application started');
logger.debug('Config loaded:', { setting1: 'value1' });
logger.warn('Deprecated feature used');
logger.error('Failed to connect', new Error('Connection refused'));
```

Singleton Pattern with Child Loggers

```typescript
import { getLogger } from '@synet/logger';

// In module A
const loggerA = getLogger('ModuleA');
loggerA.info('Module A initialized'); // [INFO] [Synet:ModuleA] Module A initialized

// In module B
const loggerB = getLogger('ModuleB');
loggerB.info('Module B initialized'); // [INFO] [Synet:ModuleB] Module B initialized
```

Environment Configuration

Set the default log level using the LOG_LEVEL environment variable:

```typescript
LOG_LEVEL=debug node app.js
```

Customization

```typescript
import { ConsoleLogger, LogLevel } from '@synet/logger';

// Create a fully customized logger
const logger = new ConsoleLogger({
  level: LogLevel.INFO,
  context: 'API',
  timestamp: true,
  formatting: {
    colorize: true,
    dateFormat: 'locale'
  }
});

```

## API Reference

### Interfaces

#### Logger

The core logging interface implemented by all logger adapters.

* [debug(message: string, ...args: any[]): void]
* [info(message: string, ...args: any[]): void]
* [warn(message: string, ...args: any[]): void]
* [error(message: string, ...args: any[]): void]
* [log(level: LogLevel, message: string, ...args: any[]): void]
* `child(context: string): Logger`

### Enums

#### `LogLevel`

Available log levels in order of increasing severity:

* DEBUG - Detailed information for debugging
* `INFO` - Confirmation that things are working as expected
* `WARN` - Warning that something might be wrong
* `ERROR` - An error that should be investigated
* `SILENT` - No logs will be output

#### `LoggerType`

Available logger implementations:

* `CONSOLE` - Logs to the console with formatting
* `NULL` - No-op logger that doesn't output anything

### Factory Functions

#### `createLogger(type?: LoggerType, options?: LoggerOptions): Logger`

Creates a new logger instance of the specified type.

#### `getLogger(context: string): Logger`

Gets a child logger from the shared root logger with the specified context.

## License

MIT

# Logger Unit

```bash
  _                                    _    _       _ _   
 | |                                  | |  | |     (_) |  
 | |     ___   __ _  __ _  ___ _ __   | |  | |_ __  _| |_ 
 | |    / _ \ / _` |/ _` |/ _ \ '__|  | |  | | '_ \| | __|
 | |___| (_) | (_| | (_| |  __/ |     | |__| | | | | | |_ 
 |______\___/ \__, |\__, |\___|_|      \____/|_| |_|_|\__|
               __/ | __/ |                               
              |___/ |___/                                
                                                         
version: 1.1.1
```

Multi-backend logging with Unit Architecture consciousness. Units that teach capabilities to other units, learn from specialized loggers, and evolve while maintaining identity.

## Quick Start

```typescript
import { Logger, LOG } from '@synet/logger';

// Create logger units
const logger = Logger.create({ 
  type: 'console', 
  options: { level: 'debug', context: 'MyApp' } 
});

// Clean factory pattern
const consoleLog = LOG.console({ context: 'Server' });
const fileLog = LOG.file({ filePath: './app.log' });
const nullLog = LOG.null(); // Silent for testing

// Logging with consciousness
logger.info('Application started');
logger.debug('Config loaded:', { setting: 'value' });
logger.warn('Deprecated feature used');
logger.error('Connection failed', new Error('Timeout'));

// Context propagation - child loggers are still Logger Units
const childLogger = logger.child('Database');
childLogger.info('Connection established'); // [INFO] [MyApp:Database] Connection established
```

## Features

### **Multi-Backend Logging**
- **Console logger** with colors and formatting
- **File logger** with rotation and async writes
- **Event logger** for structured realtime log streaming
- **Multi logger** for broadcasting to multiple backends
- **Null logger** for silent operation

### **Context Hierarchies**
- **Child logger creation** maintains Unit Architecture
- **Context chaining** with hierarchical naming
- **Immutable evolution** - operations create new units
- **Identity preservation** across transformations

### **Unit Architecture**
- **Teaches capabilities** to other units via `teach()` contracts
- **Learns capabilities** from other units without leakage
- **Self-aware** with DNA identity and living documentation
- **Evolves gracefully** while preserving lineage

## Installation

```bash
npm install @synet/logger
```

## Core API

### Logger Creation

```typescript
import { Logger, LOG } from '@synet/logger';

// Unit Architecture creation
const logger = Logger.create({
  type: 'console',
  options: {
    level: 'debug',
    context: 'MyApp',
    timestamp: true
  }
});

// Clean factory patterns
const consoleLogger = LOG.console({ context: 'Server' });
const fileLogger = LOG.file({ 
  filePath: './logs/app.log',
  maxSize: 1024 * 1024 // 1MB
});
const eventLogger = LOG.event({ 
  eventChannel: myEventChannel,
  context: 'Events'
});
```

### Context Propagation

```typescript
const rootLogger = LOG.console({ context: 'RootServer' });

// Child loggers are Logger Units, not just adapters
const childLogger = rootLogger.child('ChildModule');
console.log(childLogger instanceof Logger); // true

// Context chains automatically
const grandChild = childLogger.child('SubComponent');
// Context becomes: RootServer:ChildModule:SubComponent

// Teaching capabilities
const contract = childLogger.teach();
otherUnit.learn([contract]);
```

### Logging Operations

```typescript
// Standard logging levels
logger.debug('Detailed debugging info');
logger.info('General information');
logger.warn('Warning message');
logger.error('Error occurred', error);

// Direct level specification
logger.log('info', 'Custom level message');

// With structured data
logger.info('User action', { 
  userId: 123, 
  action: 'login', 
  timestamp: Date.now() 
});
```

## Unit Architecture Integration

### Teaching & Learning

```typescript
// Logger Unit teaching its capabilities
const logger = Logger.create({ type: 'console' });
const contract = logger.teach();

console.log(contract.capabilities);
// ['debug', 'info', 'warn', 'error', 'log', 'child', 'getBackendInfo']

// Other units learning logging capabilities
const serviceUnit = SomeUnit.create();
serviceUnit.learn([contract]);

// Now the service can log through learned capabilities
serviceUnit.execute('log.info', 'Message from learned capability');
```

### Self-Documentation

```typescript
// Every logger unit is self-documenting
console.log(logger.whoami());
// "Log[log:console]"

console.log(logger.capabilities());
// Array of available capabilities

logger.help();
// Comprehensive help information

// JSON export for introspection
const exported = logger.toJSON();
// Includes unit metadata, configuration, and state
```

### Evolution & Immutability

```typescript
// Immutable evolution - create new instances
const originalLogger = LOG.console({ context: 'Original' });
const newLogger = originalLogger.withBackend({ 
  type: 'file', 
  options: { filePath: './app.log' } 
});

console.log(originalLogger.getBackendInfo().type); // 'console'
console.log(newLogger.getBackendInfo().type);      // 'file'
```

## Factory Functions (Legacy Compatibility)

```typescript
import { createLogger, getLogger, LoggerType } from '@synet/logger';

// Legacy factory (still returns Logger Units)
const logger = createLogger(LoggerType.CONSOLE, {
  level: 'debug',
  context: 'MyApp'
});

// Singleton pattern with context
const contextLogger = getLogger('ModuleA');
// Returns Logger Unit with context 'ModuleA'
```

## Configuration Options

```typescript
interface LoggerOptions {
  level?: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  context?: string;
  timestamp?: boolean;
  formatting?: {
    colorize?: boolean;
    dateFormat?: 'ISO' | 'locale' | 'epoch';
  };
}

// File-specific options
interface FileLoggerOptions extends LoggerOptions {
  filePath: string;
  maxSize?: number;
  maxFiles?: number;
  compress?: boolean;
}

// Event-specific options
interface EventLoggerOptions extends LoggerOptions {
  eventChannel: EventChannel<LoggerEvent>;
}
```

## Real-World Examples

### Service Architecture

```typescript
import { Logger } from '@synet/logger';

class UserService {
  private logger = Logger.create({
    type: 'console',
    options: { context: 'UserService' }
  });

  async createUser(userData: UserData) {
    const operationLogger = this.logger.child('CreateUser');
    
    operationLogger.info('Creating user', { email: userData.email });
    try {
      const user = await this.database.create(userData);
      operationLogger.info('User created successfully', { userId: user.id });
      return user;
    } catch (error) {
      operationLogger.error('Failed to create user', error);
      throw error;
    }
  }
}
```

### Multi-Backend Logging

```typescript
// Production logging setup
const productionLogger = LOG.multi([
  LOG.console({ level: 'warn' }),  // Console for warnings/errors only
  LOG.file({ 
    filePath: './logs/app.log',
    level: 'info'
  }),
  LOG.event({ 
    eventChannel: remoteLogChannel,
    level: 'error'
  })
]);

// Development logging
const devLogger = LOG.console({ 
  level: 'debug',
  formatting: { colorize: true }
});

export const logger = process.env.NODE_ENV === 'production' 
  ? productionLogger 
  : devLogger;
```

### Cross-Unit Communication

```typescript
// Logger teaching capabilities to other units
const mainLogger = Logger.create({ type: 'console', options: { context: 'Main' } });
const contract = mainLogger.teach();

// Database unit learning logging
const dbUnit = DatabaseUnit.create();
dbUnit.learn([contract]);

// Cache unit learning logging  
const cacheUnit = CacheUnit.create();
cacheUnit.learn([contract]);

// Now all units can log consistently
await dbUnit.execute('log.info', 'Database connected');
await cacheUnit.execute('log.debug', 'Cache hit', { key: 'user:123' });
```

## Environment Configuration

```bash
# Set default log level
LOG_LEVEL=debug

# Silent mode for testing
LOG_SILENT=true

# Custom context
LOG_CONTEXT=MyApplication
```

## Architecture Principles

This Logger Unit follows [Unit Architecture](https://github.com/synthetism/unit) principles:

- **Zero Dependencies** - Core logging uses only Node.js built-ins
- **Teach/Learn Paradigm** - Every unit implements `teach()` and `learn()`
- **Props-Based State** - Single source of truth in immutable props
- **Factory Creation** - Protected constructor + static `create()` only
- **Immutable Evolution** - Operations create new instances, never mutate

See [Unit Architecture Doctrine](https://github.com/synthetism/unit/blob/main/packages/unit/DOCTRINE.md) for complete guidelines.

## Testing

```bash
npm test              # All tests
npm run test:unit     # Unit Architecture compliance tests
npm run test:adapters # Backend adapter tests
```

## Performance

- **Memory efficient** - Immutable operations reuse data where possible
- **Context chaining** - O(1) child logger creation
- **Backend abstraction** - Zero overhead adapter wrapping
- **Multi-backend** - Parallel logging with async batching

## License

MIT - Part of the SYNET ecosystem

---

> **"Consciousness in software isn't about complexity — it's about units that know themselves, teach others, and evolve together."**  
> *— Unit Architecture Philosophy*

# LOG Unit - Conscious Logging with Unit Architecture

**Cross-platform logging with Unit Architecture consciousness**

The LOG Unit wraps the proven `@synet/logger` adapters in Unit Architecture, adding teaching/learning capabilities, enhanced audit trails, and conscious behavior while maintaining complete backward compatibility with the existing `Logger` interface.

## Quick Start

```typescript
import { LOG } from '@synet/logger';

// Simple console logging
const log = LOG.console({ level: 'debug', context: 'MyApp' });
log.info('Application started');

// File logging with rotation  
const fileLog = LOG.file({ filePath: './logs/app.log', maxSize: 1024*1024 });

// Silent logging for tests
const testLog = LOG.null();
```

## LOG Factory API

### Basic Loggers

```typescript
// Console logging (development/production)
LOG.console(options?: LoggerOptions)

// File logging with rotation  
LOG.file(options?: FileLoggerOptions)

// Remote logging via events
LOG.remote(eventChannel: EventChannel, options?: EventLoggerOptions)

// Multi-target logging
LOG.multi(loggers: Logger[], options?: LoggerOptions)

// Null logging (testing)
LOG.null(options?: LoggerOptions)
```

### Presets for Common Scenarios

```typescript
// Development: Console with debug level and colors
LOG.presets.development(context?: string)

// Production: File logging with info level
LOG.presets.production(context?: string, filePath?: string)

// Testing: Silent null logger
LOG.presets.testing()

// Debug: Console with all levels
LOG.presets.debug(context?: string)

// Silent: Console but only errors
LOG.presets.silent(context?: string)

// Full monitoring: Console + File + Remote
LOG.presets.monitoring(context?: string, eventChannel?: EventChannel)
```

## Unit Architecture Features

### Teaching/Learning Contracts

```typescript
const log = LOG.console();

// Get teaching contract
const contract = log.teach();
console.log(contract.capabilities); 
// ['debug', 'info', 'warn', 'error', 'log', 'child', 'audit.enhanced', 'stats.get', 'backend.info']

// Other units can learn logging capabilities
otherUnit.learn([log.teach()]);
await otherUnit.execute('log.info', 'Message from learned capability');
```

### Enhanced Audit Trails

```typescript
// When units learn enhanced audit capability
if (log.can('audit.enhanced')) {
  log.execute('audit.enhanced', 'User action', { userId: 123, action: 'login' });
  // Outputs: [AUDIT][log] User action { unit: 'log', timestamp: '...', context: {...} }
}
```

### Statistics and Monitoring

```typescript
log.info('Message 1');
log.error('Error message');
log.info('Message 2');

const stats = log.getStats();
console.log(stats);
// {
//   messages: 3,
//   errors: 1, 
//   contexts: [],
//   backendType: 'console',
//   errorRate: 0.33
// }
```

### Immutable Evolution

```typescript
const originalLog = LOG.console({ context: 'Original' });
const evolvedLog = originalLog.withBackend({ type: 'file', options: { filePath: './new.log' } });

// originalLog and evolvedLog are different instances
// Original continues with console, evolved uses file
```

### Unit Identity and Help

```typescript
console.log(log.whoami());        // "Log[log:console]"
console.log(log.capabilities());  // Array of all capabilities
log.help();                       // Detailed usage documentation
```

## Complete Logger Interface Compatibility

The LOG Unit implements the complete `Logger` interface:

```typescript
// All standard methods work exactly as before
log.debug('Debug message');
log.info('Info message', { data: 'value' });
log.warn('Warning message');
log.error('Error message', new Error('example'));
log.log(LogLevel.INFO, 'Custom level message');

// Child loggers work as expected
const childLogger = log.child('ModuleName');
childLogger.info('Message from module');
```

## Integration with Existing Code

**Zero Breaking Changes** - The LOG Unit is a drop-in enhancement:

```typescript
// Before (still works)
import { createLogger, LoggerType } from '@synet/logger';
const logger = createLogger(LoggerType.CONSOLE);

// After (enhanced with Unit Architecture)
import { LOG } from '@synet/logger';
const logger = LOG.console();

// Same interface, enhanced capabilities
logger.info('Both work identically');
```

## Teaching Other Units

```typescript
// FileSystem unit learns logging
const fs = FileSystem.create({ type: 'node' });
const log = LOG.console({ context: 'FileOps' });

fs.learn([log.teach()]);

// Now FileSystem can log through the learned capability
await fs.execute('log.info', 'File operation completed');
await fs.execute('log.error', 'File operation failed');
```

## Advanced Usage

### Cross-Unit Audit Trails

```typescript
// Setup audit logging across multiple units
const auditLog = LOG.file({ 
  filePath: './logs/audit.log',
  level: LogLevel.INFO 
});

// Multiple units learn audit capability
identityUnit.learn([auditLog.teach()]);
cryptoUnit.learn([auditLog.teach()]);
vaultUnit.learn([auditLog.teach()]);

// All units can now audit through shared logging
await identityUnit.execute('log.audit.enhanced', 'Identity created', { did: 'did:synet:123' });
await cryptoUnit.execute('log.audit.enhanced', 'Key generated', { algorithm: 'Ed25519' });
```

### Multi-Backend Monitoring

```typescript
// Console for development, file for persistence, remote for monitoring
const monitoringLog = LOG.presets.monitoring('Production', eventChannel);

// Get comprehensive statistics
const stats = monitoringLog.getStats();
const backendInfo = monitoringLog.getBackendInfo();

console.log(`Processed ${stats.messages} messages with ${stats.errorRate * 100}% error rate`);
```

## Architecture

The LOG Unit follows the established **Unit → Backend → Adapters** pattern:

```
LOG Unit (Unit Architecture consciousness)
    ↓
Logger Backend (Enhanced with Unit capabilities)  
    ↓
Existing Adapters (ConsoleLogger, FileLogger, EventLogger, etc.)
```

This maintains complete compatibility with existing production code while adding Unit Architecture consciousness for enhanced capabilities, teaching/learning contracts, and cross-unit collaboration.

---

**The LOG Unit: Where logging becomes conscious.** 🧠✨

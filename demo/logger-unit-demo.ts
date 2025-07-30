#!/usr/bin/env ts-node
/**
 * Logger Unit Demo - Showcasing the renamed Logger class with Unit Architecture
 */

import { Logger, LOG } from '../src';

console.log('🧠 Logger Unit Demo - Unit Architecture with Clean Naming\n');

// Create different logger instances using the LOG factory
console.log('📝 Creating loggers using LOG factory:');

const consoleLogger = LOG.console({ 
  context: 'Demo', 
  level: 'debug' 
});

const nullLogger = LOG.null();

console.log(`- Console Logger: ${consoleLogger.whoami()}`);
console.log(`- Null Logger: ${nullLogger.whoami()}\n`);

// Demonstrate Unit Architecture consciousness
console.log('🎓 Teaching contract:');
const teaching = consoleLogger.teach();
console.log(`  - Unit ID: ${teaching.unitId}`);
console.log(`  - Capabilities: ${Object.keys(teaching.capabilities).join(', ')}`);

console.log('\n🔍 Backend information:');
const info = consoleLogger.getBackendInfo();
console.log(`  - Type: ${info.type}`);
console.log(`  - Config: ${JSON.stringify(info.config, null, 2)}`);

// Test logging functionality
console.log('\n📊 Logging tests:');
consoleLogger.info('Hello from Logger Unit! 🚀');
consoleLogger.debug('Debug message with context', { userId: 123, action: 'demo' });
consoleLogger.warn('Warning: This is just a demo');

// Test child logger creation (returns ILogger, not Logger Unit)
console.log('\n👶 Child logger test:');
const childLogger = consoleLogger.child('ChildContext');
console.log(`Child Logger created successfully`);
childLogger.info('Message from child logger');

// Test immutable evolution
console.log('\n🔄 Immutable evolution test:');
const newLogger = consoleLogger.withBackend({ type: 'null' });
console.log(`Original: ${consoleLogger.getBackendInfo().type}`);
console.log(`New: ${newLogger.getBackendInfo().type}`);

console.log('\n✅ Logger Unit Demo Complete!');

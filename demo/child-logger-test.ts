#!/usr/bin/env ts-node
/**
 * Test child logger context propagation
 */

import { LOG, Logger } from '../src';

console.log('🔍 Testing Child Logger Context Propagation\n');

// Create root logger
const rootLogger = LOG.console({ context: 'RootServer' });
console.log('Root Logger:', rootLogger.whoami());
console.log('Root Backend Info:', JSON.stringify(rootLogger.getBackendInfo().config, null, 2));

// Create child logger
const childLogger = rootLogger.child('ChildModule');
console.log('\nChild Logger:', childLogger.whoami());
console.log('Child Backend Info:', JSON.stringify(childLogger.getBackendInfo().config, null, 2));

// Verify child is a Logger Unit, not just ILogger
console.log('\nChild Logger is Logger Unit:', childLogger instanceof Logger);
console.log('Child Logger teach capabilities:', Object.keys(childLogger.teach().capabilities));

// Test nested child
const grandChildLogger = childLogger.child('GrandChild');
console.log('\nGrand Child Logger:', grandChildLogger.whoami());
console.log('Grand Child Backend Info:', JSON.stringify(grandChildLogger.getBackendInfo().config, null, 2));

// Test logging with context propagation
console.log('\n📝 Testing Context in Log Messages:');
rootLogger.info('Message from root logger');
childLogger.info('Message from child logger');
grandChildLogger.info('Message from grandchild logger');

console.log('\n✅ Context propagation test complete!');

#!/usr/bin/env ts-node
/**
 * Test getLogger function returns Logger Units
 */

import { getLogger, LoggerType, Logger } from '../src';

console.log('🔍 Testing getLogger Function\n');

// Test basic getLogger
const contextLogger = getLogger('TestContext');
console.log('Context Logger:', contextLogger.whoami());
console.log('Context Logger is Logger Unit:', contextLogger instanceof Logger);
console.log('Context Logger Backend Info:', JSON.stringify(contextLogger.getBackendInfo().config, null, 2));

// Test getLogger with specific type
const nullLogger = getLogger('NullContext', LoggerType.NULL);
console.log('\nNull Logger:', nullLogger.whoami());
console.log('Null Logger is Logger Unit:', nullLogger instanceof Logger);

// Test child from getLogger result
const childFromGetLogger = contextLogger.child('SubModule');
console.log('\nChild from getLogger:', childFromGetLogger.whoami());
console.log('Child from getLogger is Logger Unit:', childFromGetLogger instanceof Logger);
console.log('Child from getLogger Context:', JSON.stringify(childFromGetLogger.getBackendInfo().config, null, 2));

// Test logging
console.log('\n📝 Testing Log Messages:');
contextLogger.info('Message from getLogger result');
childFromGetLogger.info('Message from child of getLogger result');

console.log('\n✅ getLogger test complete!');

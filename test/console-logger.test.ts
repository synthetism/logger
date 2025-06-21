import { ConsoleLogger } from '../src/adapters/console-logger';
import { LogLevel } from '../src/level';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('ConsoleLogger', () => {
  // Spy on console methods
  const consoleMethods = {
    debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    info: vi.spyOn(console, 'info').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    log: vi.spyOn(console, 'log').mockImplementation(() => {})
  };

  beforeEach(() => {
    // Reset all mock implementations before each test
    for (const method of Object.values(consoleMethods)) {
      method.mockClear();
    }
  });

  it('should log messages at the appropriate level', () => {
    const logger = new ConsoleLogger({
      level: LogLevel.DEBUG,
      timestamp: false, // Disable timestamps for easier testing
    });

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    expect(consoleMethods.debug).toHaveBeenCalledTimes(1);
    expect(consoleMethods.info).toHaveBeenCalledTimes(1);
    expect(consoleMethods.warn).toHaveBeenCalledTimes(1);
    expect(consoleMethods.error).toHaveBeenCalledTimes(1);
  });

  it('should respect minimum log level', () => {
    const logger = new ConsoleLogger({
      level: LogLevel.WARN,
      timestamp: false,
    });

    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    expect(consoleMethods.debug).not.toHaveBeenCalled();
    expect(consoleMethods.info).not.toHaveBeenCalled();
    expect(consoleMethods.warn).toHaveBeenCalledTimes(1);
    expect(consoleMethods.error).toHaveBeenCalledTimes(1);
  });

  it('should create child loggers with extended context', () => {
    const parent = new ConsoleLogger({
      context: 'Parent',
      timestamp: false,
    });

    const child = parent.child('Child');
    child.info('Child message');

    expect(consoleMethods.info).toHaveBeenCalledWith(
      expect.stringContaining('[Parent:Child]'),
      'Child message'
    );
  });

  it('should format message templates with context', () => {
    const logger = new ConsoleLogger({
      timestamp: false,
    });

    logger.info('User {name} logged in from {ip}', { 
      name: 'John', 
      ip: '192.168.1.1' 
    });

    expect(consoleMethods.info).toHaveBeenCalledWith(
      expect.any(String),
      'User John logged in from 192.168.1.1',
      { name: 'John', ip: '192.168.1.1' }
    );
  });

  it('should handle nested properties in templates', () => {
    const logger = new ConsoleLogger({
      timestamp: false,
    });

    logger.info('Request to {request.path} from {request.client.ip}', {
      request: {
        path: '/api/users',
        client: {
          ip: '10.0.0.1'
        }
      }
    });

    expect(consoleMethods.info).toHaveBeenCalledWith(
      expect.any(String),
      'Request to /api/users from 10.0.0.1',
      expect.any(Object)
    );
  });

  it('should handle multiple arguments after template context', () => {
    const logger = new ConsoleLogger({
      timestamp: false,
    });

    const error = new Error('Something went wrong');
    logger.error('Failed to process {item}', { item: 'payment' }, error, { additionalInfo: 'retry later' });

    expect(consoleMethods.error).toHaveBeenCalledWith(
      expect.any(String),
      'Failed to process payment',
      { item: 'payment' },
      error,
      { additionalInfo: 'retry later' }
    );
  });

  // Update this test

it('should properly strip nested color codes from arguments', () => {
  const logger = new ConsoleLogger({
    timestamp: false,
    formatting: { colorize: false }
  });
  
  const message = 'This is';
  const coloredArg = { 
    test: '\x1B[1mThis is\x1B[34m blue and bold\x1B[0m'
  };
  
  logger.info(message, coloredArg);
  
  // The nested color codes should all be removed
  expect(consoleMethods.info).toHaveBeenCalledWith(
    expect.any(String),
    message,
    { test: 'This is blue and bold' }
  );
});

it('should handle chalk-style bold format', () => {
  const logger = new ConsoleLogger({
    timestamp: false,
    formatting: { colorize: false }
  });
  
  const message = 'Debug log:';
  const coloredArg = { 
    type: '\x1B[1mlogger.debug\x1B[22m'
  };
  
  logger.info(message, coloredArg);
  
  expect(consoleMethods.info).toHaveBeenCalledWith(
    expect.any(String),
    message,
    { type: 'logger.debug' }
  );
});
});
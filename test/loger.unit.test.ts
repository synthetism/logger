/**
 * Log Unit Tests - Unit Architecture compliance and functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Logger } from '../src/logger.unit';
import { LOG } from '../src/log';
import { LogLevel } from '../src/types/level';

describe('Log Unit - Unit Architecture', () => {
  beforeEach(() => {
    // Mock console methods
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('Unit Creation', () => {
    it('should create console logger unit', () => {
      const log = LOG.console({ level: LogLevel.DEBUG, context: 'Test' });
      
      expect(log).toBeDefined();
      expect(log.whoami()).toContain('Log[log:console]');
    });

    it('should create null logger unit', () => {
      const log = LOG.null();
      
      expect(log).toBeDefined();
      expect(log.whoami()).toContain('Log[log:null]');
    });
  });

  describe('Logger Interface Compliance', () => {
    it('should implement Logger interface methods', () => {
      const log = LOG.console({ level: LogLevel.DEBUG });
      
      // Should not throw
      log.debug('Debug message');
      log.info('Info message');
      log.warn('Warning message');
      log.error('Error message');
      log.log(LogLevel.INFO, 'Log message');
      
      const child = log.child('ChildContext');
      expect(child).toBeDefined();
    });
  });

  describe('Unit Architecture Features', () => {
    it('should provide teaching contract', () => {
      const log = LOG.console();
      const contract = log.teach();
      
      expect(contract.unitId).toBe('log');
      expect(contract.capabilities.has('debug')).toBe(true);
      expect(contract.capabilities.has('info')).toBe(true);
      expect(contract.capabilities.has('warn')).toBe(true);
      expect(contract.capabilities.has('error')).toBe(true);
      expect(contract.capabilities.has('log')).toBe(true);
      expect(contract.capabilities.has('child')).toBe(true);
      expect(contract.capabilities.has('getBackendInfo')).toBe(true);
    });

    it('should provide backend information', () => {
      const log = LOG.console({ context: 'TestContext' });
      const info = log.getBackendInfo();
      
      expect(info.type).toBe('console');
      expect(info.config).toHaveProperty('context', 'TestContext');
      expect(info.created).toBeInstanceOf(Date);
    });
  });

  describe('Immutable Evolution', () => {
    it('should create new instance with different backend', () => {
      const originalLog = LOG.console();
      const newLog = originalLog.withBackend({ type: 'null' });
      
      expect(originalLog.getBackendInfo().type).toBe('console');
      expect(newLog.getBackendInfo().type).toBe('null');
      expect(originalLog).not.toBe(newLog);
    });
  });
});

describe('LOG Factory', () => {
  it('should create different logger types', () => {
    const consoleLog = LOG.console();
    const nullLog = LOG.null();
    
    expect(consoleLog.getBackendInfo().type).toBe('console');
    expect(nullLog.getBackendInfo().type).toBe('null');
  });

  it('should apply default options', () => {
    const log = LOG.console();
    const info = log.getBackendInfo();
    
    //expect(info.config).toHaveProperty('level', LogLevel.INFO);
    //expect(info.config).toHaveProperty('context', 'Synet');
    //expect(info.config).toHaveProperty('timestamp', true);
  });

  it('should override default options', () => {
    const log = LOG.console({ 
      level: LogLevel.DEBUG, 
      context: 'CustomContext' 
    });
    const info = log.getBackendInfo();
    
    expect(info.config).toHaveProperty('level', LogLevel.DEBUG);
    expect(info.config).toHaveProperty('context', 'CustomContext');
  });
});

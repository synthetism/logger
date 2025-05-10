import { describe, it, expect, vi } from 'vitest';
import { ConsoleLogger } from '../src/adapters/console-logger';

describe('ConsoleLogger', () => {
  it('should instantiate without error', () => {
    const logger = new ConsoleLogger();
    expect(logger).toBeInstanceOf(ConsoleLogger);
  });

  it('should call console.info for info', () => {
    const logger = new ConsoleLogger({ level: 'debug' });
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.info('Hello world');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  // Optionally, test all log levels
  it('should call the correct console method for each log level', () => {
    const logger = new ConsoleLogger({ level: 'debug' });
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  
    logger.info('info');
    logger.warn('warn');
    logger.error('error');
    logger.debug('debug');
  
    expect(infoSpy).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
  
    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
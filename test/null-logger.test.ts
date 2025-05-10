import { describe, it, expect, vi } from 'vitest';
import { NullLogger } from '../src/adapters/null-logger';

describe('NullLogger', () => {
  it('should not call console methods', () => {
    const logger = new NullLogger();
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logger.info('Should not log');
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
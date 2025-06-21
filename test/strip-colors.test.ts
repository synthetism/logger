import { hasAnsiColorCodes, stripAnsiColorCodes, Colors } from '../src/utils/ansi-colors';
import { describe, it, expect } from 'vitest';

describe('ANSI color utilities', () => {
  it('should detect ANSI color codes used by chalk', () => {
    expect(hasAnsiColorCodes('regular text')).toBe(false);
    expect(hasAnsiColorCodes('\x1B[31mcolored text\x1B[0m')).toBe(true);
    expect(hasAnsiColorCodes('\x1B[1mbold text\x1B[0m')).toBe(true);
  });

  it('should strip ANSI color codes', () => {
    expect(stripAnsiColorCodes('regular text')).toBe('regular text');
    expect(stripAnsiColorCodes('\x1B[31mcolored text\x1B[0m')).toBe('colored text');
    expect(stripAnsiColorCodes('\x1B[1mbold \x1B[31mand red\x1B[0m text')).toBe('bold and red text');
  });
  
  it('should handle chalk-style format with bold modifier', () => {
    const boldText = '\x1B[1mlogger.debug\x1B[22m'; // Bold on / Bold off
    expect(hasAnsiColorCodes(boldText)).toBe(true);
    expect(stripAnsiColorCodes(boldText)).toBe('logger.debug');
  });
  
  it('should handle nested and complex color combinations', () => {
    const nestedColors = '\x1B[1mThis is\x1B[34m blue and bold\x1B[0m';
    expect(stripAnsiColorCodes(nestedColors)).toBe('This is blue and bold');
    
    const complexNesting = '\x1B[31mRed \x1B[1mand bold \x1B[4mand underlined\x1B[0m text';
    expect(stripAnsiColorCodes(complexNesting)).toBe('Red and bold and underlined text');
  });
});
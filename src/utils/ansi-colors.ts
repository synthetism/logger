/**
 * Common ANSI color codes for terminal output
 */
export const Colors = {
  reset: "\x1B[0m",
  // Regular colors
  black: "\x1B[30m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  white: "\x1B[37m",
  gray: "\x1B[90m",
  // Bright colors
  brightRed: "\x1B[91m",
  brightGreen: "\x1B[92m",
  brightYellow: "\x1B[93m",
  brightBlue: "\x1B[94m",
  brightMagenta: "\x1B[95m",
  brightCyan: "\x1B[96m",
  brightWhite: "\x1B[97m",
  // Text styles
  bold: "\x1B[1m",
  dim: "\x1B[2m",
  italic: "\x1B[3m",
  underline: "\x1B[4m",
};

// Regular expression for ANSI color/style codes
// This matches all standard ANSI color sequences used by Chalk
const ANSI_COLOR_REGEX = /\x1B\[\d+(;\d+)*m/g;

/**
 * Checks if a string contains any ANSI color codes
 * @param str String to check
 */
export function hasAnsiColorCodes(str: string): boolean {
  
  console.log('Checking for ANSI color codes in:', str);
  
  // Ensure the input is a string
  if (typeof str !== 'string') {
    return false;
  }
  // Reset the regex before testing
  ANSI_COLOR_REGEX.lastIndex = 0;
  return ANSI_COLOR_REGEX.test(str);
}

/**
 * Strips all ANSI color codes from a string
 * @param str String to strip colors from
 */
export function stripAnsiColorCodes(str: string): string {
 
  if (typeof str !== 'string') {
    return str;
  }

  return str.replace(ANSI_COLOR_REGEX, '');
}
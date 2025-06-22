// Regular expression for ANSI color/style codes
// This matches all standard ANSI color sequences used by Chalk
const ANSI_COLOR_REGEX = /\x1B\[\d+(;\d+)*m/g;

/**
 * Checks if a string contains any ANSI color codes
 * @param str String to check
 */
export function hasAnsiColorCodes(str: string): boolean {
  console.log("Checking for ANSI color codes in:", str);

  // Ensure the input is a string
  if (typeof str !== "string") {
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
  if (typeof str !== "string") {
    return str;
  }

  return str.replace(ANSI_COLOR_REGEX, "");
}

/**
 * Strip colors from any value, recursively traversing objects
 */
export function stripColorsFromObj(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle strings
  if (typeof obj === "string") {
    return stripAnsiColorCodes(obj);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => stripColorsFromObj(item));
  }

  // Skip if not an object or is an Error
  if (typeof obj !== "object" || obj instanceof Error) {
    return obj;
  }

  // Handle plain objects
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = stripColorsFromObj(value);
  }

  return result;
}

export function stripColorsFromArgs(args: unknown[]): unknown[] {
  const strippedArgs = args.map((arg) => {
    if (typeof arg === "string") {
      return stripAnsiColorCodes(arg);
    }
    if (typeof arg === "object" && arg !== null) {
      return stripColorsFromObj(arg);
    }
    return arg;
  });

  return strippedArgs;
}

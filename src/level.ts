/**
 * Standard log levels as string literal union and value object.
 */
export const LogLevel = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  SILENT: "silent",
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

/**
 * Maps log levels to numeric values for comparison
 * Higher number = more severe
 */
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.SILENT]: 4,
};

/**
 * Check if a given level should be logged at the current minimum level
 */
export function shouldLog(
  currentLevel: LogLevel,
  minimumLevel: LogLevel,
): boolean {
  return LOG_LEVEL_VALUES[currentLevel] >= LOG_LEVEL_VALUES[minimumLevel];
}

/**
 * Formats a message string by replacing {placeholders} with values from the context object
 *
 * @param message The message template with {placeholders}
 * @param context Object containing values for the placeholders
 * @returns Formatted message string
 */
export function formatMessage(
  message: string,
  context?: Record<string, unknown>,
): string {
  if (!context || typeof message !== "string") {
    return message;
  }

  return message.replace(/{([^}]+)}/g, (match, key) => {
    // Split the key path (e.g., "user.name" becomes ["user", "name"])
    const pathParts = key.split(".");

    // Navigate through the object to get the value
    let value: unknown = context;
    for (const part of pathParts) {
      if (value === null || value === undefined || typeof value !== "object") {
        value = undefined;
        break;
      }
      // Type assertion here is unavoidable when navigating object properties dynamically
      value = (value as Record<string, unknown>)[part];
    }

    if (value === undefined) {
      return match; // Keep the placeholder if value not found
    }

    // Handle different types of values
    if (typeof value === "object" && value !== null) {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }

    return String(value);
  });
}

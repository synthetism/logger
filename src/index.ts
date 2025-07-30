// Core exports
export * from "./types/logger.interface";
export * from "./types/event-channel.interface";
export * from "./types/level";
export * from "./types/logger-events";

// Adapter implementations
export * from "./adapters";

// Factory functions (legacy)
export * from "./factory";

// Unit Architecture exports (NEW)
export { Logger } from "./logger.unit";
export * from "./log";

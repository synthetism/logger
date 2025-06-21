import type { RealtimeEvent } from "./realtime-event";
//import type { Event } from "@synet/patterns";

export type LoggerEventType =
  | "logger.info"
  | "logger.error"
  | "logger.warning"
  | "logger.debug";

export interface LoggerEvent extends RealtimeEvent {
  type: LoggerEventType;
  data: {
    message: string;
    [key: string]: unknown;
  };
}

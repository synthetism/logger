/**
 * Generic interface for a channel that can publish events
 */
export interface EventChannel<TEvent = unknown> {
  /**
   * Publishes an event to the specified channel
   * @param channel The channel to publish to
   * @param event The event data to publish
   */
  publish(event: TEvent): Promise<void>;
}
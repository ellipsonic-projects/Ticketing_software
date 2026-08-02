/* eslint-disable */
import { EventEmitter } from 'events';

import { DomainEvent } from './types';

type EventHandler<T extends DomainEvent> = (event: T) => void | Promise<void>;

class Dispatcher {
  private emitter = new EventEmitter();

  constructor() {
    // Increase max listeners if needed, default is 10
    this.emitter.setMaxListeners(50);
  }

  /**
   * Subscribes a handler to a specific event type.
   */
  public subscribe<T extends DomainEvent>(
    eventClass: new (...args: any[]) => T,
    handler: EventHandler<T>,
  ): void {
    // We use the class name as the event name
    this.emitter.on(eventClass.name, async (event: T) => {
      try {
        await handler(event);
      } catch (error) {
        // Error isolation: log the error but don't crash the process or affect other handlers
        console.error(`[EventDispatcher] Handler for ${eventClass.name} failed:`, error);
      }
    });
  }

  /**
   * Publishes a domain event asynchronously to all subscribed handlers.
   */
  public publish(event: DomainEvent): void {
    // SetImmediate ensures that the handlers run asynchronously,
    // fully decoupling them from the main transaction/request thread.
    setImmediate(() => {
      try {
        this.emitter.emit(event.constructor.name, event);
      } catch (error) {
        console.error(`[EventDispatcher] Failed to emit event ${event.constructor.name}:`, error);
      }
    });
  }
}

// Export as a singleton
export const eventDispatcher = new Dispatcher();

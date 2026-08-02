import { TicketEmailHandler } from '@/services/notifications/ticket-email-handler';

let isRegistered = false;

/**
 * Initializes and registers all event handlers to the EventDispatcher.
 * This should be imported exactly once, typically in a root layout or main API entrypoint.
 */
export function registerEventHandlers() {
  if (isRegistered) return;

  console.log('[EventRegistry] Registering domain event handlers...');

  // Register all handlers
  TicketEmailHandler.register();

  isRegistered = true;
}

// Auto-register when this file is imported
registerEventHandlers();

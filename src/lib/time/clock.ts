/**
 * Centralized Time Provider.
 * Replaces direct `new Date()` calls across the application
 * to make time predictable and testable.
 */
export const clock = {
  /**
   * Returns the current date as a Date object.
   */
  now(): Date {
    return new Date();
  },

  /**
   * Returns the current date as an ISO 8601 string.
   */
  iso(): string {
    return new Date().toISOString();
  },
};

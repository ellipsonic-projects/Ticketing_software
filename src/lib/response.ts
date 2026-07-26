import { ApiResponder } from './api-response';

// Export convenient wrapper functions
export const successResponse = ApiResponder.success;
export const errorResponse = ApiResponder.error;

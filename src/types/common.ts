export type Id = string;

export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export const Success = <T>(data: T): Result<T, never> => ({ success: true, data });
export const Failure = <E>(error: E): Result<never, E> => ({ success: false, error });

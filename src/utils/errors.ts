/**
 * Application Error Class
 * 
 * Simple, unified error class for all application errors.
 * All AppError instances are operational (expected/safe to show to client).
 * 
 * @param statusCode - HTTP status code (e.g., 404, 400, 500)
 * @param message - Human-readable error message
 * 
 * @example
 * throw new AppError(HTTP_STATUS.NOT_FOUND, MESSAGES.ISSUE.NOT_FOUND);
 * throw new AppError(HTTP_STATUS.BAD_REQUEST, MESSAGES.ISSUE.TITLE_TOO_SHORT);
 * throw new AppError(HTTP_STATUS.CONFLICT, MESSAGES.AUTH.USER_ALREADY_EXISTS);
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

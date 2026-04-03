import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/errors";
import { STATUS_CODE_500 } from "../../utils/statusCodes";
import { MESSAGES } from "../../utils/messages";

/**
 * Global Error Handler Middleware
 * 
 * Centralized error handling for the entire application.
 * Must be registered as the LAST middleware in app.ts.
 * 
 * Features:
 * - Identifies error type and sets appropriate status code
 * - Logs all errors with context
 * - Hides sensitive data from client (security)
 * - Returns consistent error response format
 * - Handles Mongoose, JWT, and custom errors
 * 
 * @param err - Error object
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number = STATUS_CODE_500;
  let message: string = MESSAGES.GENERAL.INTERNAL_SERVER_ERROR;

  // Handle our AppError (all expected errors)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Everything else is an unexpected programming error (500)

  // Log error details
  console.error("❌ Error occurred:", {
    timestamp: new Date().toISOString(),
    message: err.message,
    statusCode,
    isAppError: err instanceof AppError,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  // Send response to client
  res.status(statusCode).json({
    success: false,
    message,
    
    // Include stack trace only in development mode
    ...(process.env.NODE_ENV === "development" && { 
      stack: err.stack,
      error: err.message 
    }),
  });
};

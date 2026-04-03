import { Request, Response, NextFunction } from "express";

/**
 * Async Handler Wrapper
 * 
 * Wraps async route handlers to automatically catch errors and pass them to Express error handler.
 * Eliminates the need for try/catch blocks in controllers.
 * 
 * @param fn - Async controller function
 * @returns Wrapped function that catches errors
 * 
 * @example
 * // Without asyncHandler (old way)
 * export const getIssue = async (req, res) => {
 *   try {
 *     const issue = await issueService.getIssue(req.params.id);
 *     res.json({ success: true, data: issue });
 *   } catch (err) {
 *     res.status(500).json({ success: false, message: err.message });
 *   }
 * };
 * 
 * // With asyncHandler (new way)
 * export const getIssue = asyncHandler(async (req, res) => {
 *   const issue = await issueService.getIssue(req.params.id);
 *   res.json({ success: true, data: issue });
 * });
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
// When an error is thrown:

// fn(req, res, next) rejects (because service threw error)
// .catch(next) catches the rejection
// next(error) passes error to Express
// Express skips to error handler middleware

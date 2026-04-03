import { Request, Response, NextFunction } from "express";
import { IssueStatus, IssuePriority } from "../issue/issue.model";

export const validateIssue = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, status, priority } = req.body;

  // Validate title if provided
  if (title !== undefined) {
    const trimmed = typeof title === "string" ? title.trim() : "";
    if (!trimmed || trimmed.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 3 characters",
      });
    }
    req.body.title = trimmed; // Store trimmed version
  }

  // Validate description if provided
  if (description !== undefined) {
    const trimmed = typeof description === "string" ? description.trim() : "";
    if (!trimmed || trimmed.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 10 characters",
      });
    }
    req.body.description = trimmed;
  }

  // Validate status enum
  if (status && !Object.values(IssueStatus).includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${Object.values(IssueStatus).join(", ")}`,
    });
  }

  // Validate priority enum
  if (priority && !Object.values(IssuePriority).includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Invalid priority. Must be one of: ${Object.values(IssuePriority).join(", ")}`,
    });
  }

  next();
};

export default validateIssue;   
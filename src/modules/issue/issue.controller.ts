import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { IssueStatus, IssuePriority } from "./issue.model";
import * as issueService from "./issue.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/errors";
import { STATUS_CODE_201, STATUS_CODE_200, STATUS_CODE_400, STATUS_CODE_401 } from "../../utils/statusCodes";
import { MESSAGES } from "../../utils/messages";

export const createIssue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, priority, status, assigneeId } = req.body;
  const createdById = req.user?.userId;

  if (!createdById) {
    throw new AppError(STATUS_CODE_401, MESSAGES.AUTH.AUTHENTICATION_REQUIRED);
  }

  const trimmedTitle = typeof title === "string" ? title.trim() : "";
  const trimmedDescription = typeof description === "string" ? description.trim() : "";

  if (!trimmedTitle || trimmedTitle.length < 3) {
    throw new AppError(STATUS_CODE_400, MESSAGES.ISSUE.TITLE_TOO_SHORT);
  }

  if (!trimmedDescription || trimmedDescription.length < 10) {
    throw new AppError(STATUS_CODE_400, MESSAGES.ISSUE.DESCRIPTION_TOO_SHORT);
  }

  if (priority && !Object.values(IssuePriority).includes(priority)) {
    throw new AppError(
      STATUS_CODE_400,
      MESSAGES.VALIDATION.INVALID_ENUM("priority", Object.values(IssuePriority))
    );
  }

  if (status && !Object.values(IssueStatus).includes(status)) {
    throw new AppError(
      STATUS_CODE_400,
      MESSAGES.VALIDATION.INVALID_ENUM("status", Object.values(IssueStatus))
    );
  }

  const issue = await issueService.createIssue({
    title: trimmedTitle,
    description: trimmedDescription,
    priority,
    status,
    createdById,
    assigneeId,
  });

  return res.status(STATUS_CODE_201).json({
    success: true,
    data: issue,
  });
});

export const getIssues = asyncHandler(async (req: AuthRequest, res: Response) => {
  const issues = await issueService.getIssues();

  return res.status(STATUS_CODE_200).json({
    success: true,
    data: issues,
  });
});

export const updateIssue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const issueId = req.params.id as string;
  const { title, description, status, priority, assigneeId } = req.body;

  // Validate if fields are provided
  if (title !== undefined) {
    const trimmedTitle = typeof title === "string" ? title.trim() : "";
    if (!trimmedTitle || trimmedTitle.length < 3) {
      throw new AppError(STATUS_CODE_400, MESSAGES.ISSUE.TITLE_TOO_SHORT);
    }
  }

  if (description !== undefined) {
    const trimmedDescription = typeof description === "string" ? description.trim() : "";
    if (!trimmedDescription || trimmedDescription.length < 10) {
      throw new AppError(STATUS_CODE_400, MESSAGES.ISSUE.DESCRIPTION_TOO_SHORT);
    }
  }

  if (priority && !Object.values(IssuePriority).includes(priority)) {
    throw new AppError(
      STATUS_CODE_400,
      MESSAGES.VALIDATION.INVALID_ENUM("priority", Object.values(IssuePriority))
    );
  }

  if (status && !Object.values(IssueStatus).includes(status)) {
    throw new AppError(
      STATUS_CODE_400,
      MESSAGES.VALIDATION.INVALID_ENUM("status", Object.values(IssueStatus))
    );
  }

  const updatedIssue = await issueService.updateIssue(issueId, {
    title,
    description,
    status,
    priority,
    assigneeId,
  });

  return res.status(STATUS_CODE_200).json({
    success: true,
    data: updatedIssue,
  });
});

export const deleteIssue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const issueId = req.params.id as string;

  await issueService.deleteIssue(issueId);

  return res.status(STATUS_CODE_200).json({
    success: true,
    message: MESSAGES.ISSUE.DELETED,
  });
});

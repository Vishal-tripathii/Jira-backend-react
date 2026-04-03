import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { IssueStatus, IssuePriority } from "./issue.model";
import * as issueService from "./issue.service";

export const createIssue = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, status, assigneeId } = req.body;
    const createdById = req.user?.userId;

    if (!createdById) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const trimmedTitle = typeof title === "string" ? title.trim() : "";
    const trimmedDescription = typeof description === "string" ? description.trim() : "";

    if (!trimmedTitle || trimmedTitle.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Title is required and must be at least 3 characters",
      });
    }

    if (!trimmedDescription || trimmedDescription.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Description is required and must be at least 10 characters",
      });
    }

    if (priority && !Object.values(IssuePriority).includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Invalid priority. Must be one of: ${Object.values(IssuePriority).join(", ")}`,
      });
    }

    if (status && !Object.values(IssueStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${Object.values(IssueStatus).join(", ")}`,
      });
    }

    const issue = await issueService.createIssue({
      title: trimmedTitle,
      description: trimmedDescription,
      priority,
      status,
      createdById,
      assigneeId,
    });

    return res.status(201).json({
      success: true,
      data: issue,
    });
  } catch (err: any) {
    return res.status(err.statusCode || err.status || 500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const getIssues = async (req: AuthRequest, res: Response) => {
  try {
    const issues = await issueService.getIssues();

    return res.status(200).json({
      success: true,
      data: issues,
    });
  } catch (err: any) {
    return res.status(err.statusCode || err.status || 500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const updateIssue = async(req: AuthRequest, res: Response) => {
    try {
        const issueId = req.params.id as string;  // <-- Cast here
        const {title, description, status, priority, assigneeId} = req.body;
        const createdById = req.user?.userId;

        if (!createdById) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const updatedIssue = await issueService.updateIssue(
                issueId,
                {
                    title,
                    description,
                    status,
                    priority,
                    assigneeId,
                });

        return res.status(200).json({
            success: true,
            data: updatedIssue,
        });
    } catch (err: any) {
        return res.status(err.statusCode || err.status || 500).json({
            success: false,
            message: err.message || "Internal server error",
        }); 
    }
}

export const deleteIssue = async(req: AuthRequest, res: Response) => {
    try {
        const issueId = req.params.id as string;  // <-- Cast here
        const createdById = req.user?.userId;

        if (!createdById) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const deletedIssue = await issueService.deleteIssue(issueId);

        return res.status(200).json({
            success: true,
            data: deletedIssue,
        });
    } catch (err: any) {
        return res.status(err.statusCode || err.status || 500).json({
            success: false,
            message: err.message || "Internal server error",
        }); 
    }
}

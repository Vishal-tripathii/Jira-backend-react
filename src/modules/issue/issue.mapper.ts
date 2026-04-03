import { Types } from "mongoose";
import { UserRole } from "../../models/user.model";
import { IIssue, IssuePriority, IssueStatus } from "./issue.model";

type PopulatedUser = {
  _id: Types.ObjectId;
  email: string;
  role: UserRole;
};

export interface IssueDTO {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: { id: string; email: string; role: UserRole } | null;
  createdBy: { id: string; email: string; role: UserRole };
  createdAt: Date;
  updatedAt: Date;
}

export const mapIssueToDTO = (issue: IIssue): IssueDTO => {
  const assignee = issue.assigneeId as unknown as PopulatedUser | undefined;
  const createdBy = issue.createdById as unknown as PopulatedUser;

  if (!createdBy || createdBy instanceof Types.ObjectId) {
    throw new Error("createdById must be populated before mapping to DTO");
  }

  return {
    id: issue._id.toString(),
    title: issue.title,
    description: issue.description,
    status: issue.status,
    priority: issue.priority,
    assignee: assignee && !(assignee instanceof Types.ObjectId)
      ? {
          id: assignee._id.toString(),
          email: assignee.email,
          role: assignee.role,
        }
      : null,
    createdBy: {
      id: createdBy._id.toString(),
      email: createdBy.email,
      role: createdBy.role,
    },
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
  };
};

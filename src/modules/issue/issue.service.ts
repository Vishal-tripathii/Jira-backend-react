import { User } from "../../models/user.model";
import { Issue, IssuePriority, IssueStatus, CreateIssueInput } from "./issue.model";
import { IssueDTO, mapIssueToDTO } from "./issue.mapper";
import { AppError } from "../../utils/errors";
import { STATUS_CODE_404 } from "../../utils/statusCodes";
import { MESSAGES } from "../../utils/messages";

const USER_POPULATE_FIELDS = "email role";

export const createIssue = async (input: CreateIssueInput): Promise<IssueDTO> => {
    if (input.assigneeId) {
        const assigneeExists = await User.exists({ _id: input.assigneeId });
        if (!assigneeExists) {
            throw new AppError(STATUS_CODE_404, MESSAGES.ISSUE.ASSIGNEE_NOT_FOUND);
        }
    }

    const issue = await Issue.create({
        title: input.title,
        description: input.description,
        status: input.status || IssueStatus.OPEN,
        priority: input.priority || IssuePriority.MEDIUM,
        createdById: input.createdById,
        assigneeId: input.assigneeId || undefined,
    });

    await issue.populate([
        { path: "assigneeId", select: USER_POPULATE_FIELDS },
        { path: "createdById", select: USER_POPULATE_FIELDS },
    ]);

    return mapIssueToDTO(issue);
};

export const getIssues = async (): Promise<IssueDTO[]> => {
    const issues = await Issue.find()
        .sort({ createdAt: -1 })
        .populate({ path: "assigneeId", select: USER_POPULATE_FIELDS })
        .populate({ path: "createdById", select: USER_POPULATE_FIELDS });

    return issues.map(mapIssueToDTO);
};

export const updateIssue = async (id: string, updateData: Partial<CreateIssueInput>): Promise<IssueDTO> => {
    // Validate assignee if provided
    if (updateData.assigneeId) {
        const assigneeExists = await User.exists({ _id: updateData.assigneeId });
        if (!assigneeExists) {
            throw new AppError(STATUS_CODE_404, MESSAGES.ISSUE.ASSIGNEE_NOT_FOUND);
        }
    }

    // Update and return in one query
    const updatedIssue = await Issue.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    )
        .populate({ path: "assigneeId", select: USER_POPULATE_FIELDS })
        .populate({ path: "createdById", select: USER_POPULATE_FIELDS });

    if (!updatedIssue) {
        throw new AppError(STATUS_CODE_404, MESSAGES.ISSUE.NOT_FOUND);
    }

    return mapIssueToDTO(updatedIssue);
}

export const deleteIssue = async (id: string): Promise<void> => {
    const issue = await Issue.findById(id);

    if (!issue) {
        throw new AppError(STATUS_CODE_404, MESSAGES.ISSUE.NOT_FOUND);
    }

    await Issue.findByIdAndDelete(id);
};

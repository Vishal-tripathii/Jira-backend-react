import { User } from "../../models/user.model";
import { Issue, IssuePriority, IssueStatus, CreateIssueInput, IIssue } from "./issue.model";
import { IssueDTO, mapIssueToDTO } from "./issue.mapper";

const USER_POPULATE_FIELDS = "email role";

export const createIssue = async (input: CreateIssueInput): Promise<IssueDTO> => {
    if (input.assigneeId) {
        const assigneeExists = await User.exists({ _id: input.assigneeId });
        if (!assigneeExists) {
            const err: any = new Error("Assignee not found");
            err.status = 404;
            throw err;
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
    try {
        const issue = await Issue.findById(id);

        if (!issue) {
            const err: any = new Error("Issue not found");
            err.status = 404;
            throw err;
        }

        if (updateData.assigneeId) {
            const assigneeExists = await User.exists({ _id: updateData.assigneeId });
            if (!assigneeExists) {
                const err: any = new Error("Assignee not found");
                err.status = 404;
                throw err;
            }
        }

        const updatedIssue = await Issue.findByIdAndUpdate(id, updateData, { new: true })
            .populate({ path: "assigneeId", select: USER_POPULATE_FIELDS })
            .populate({ path: "createdById", select: USER_POPULATE_FIELDS });

        if (!updatedIssue) {
            const err: any = new Error("Issue not found");
            err.status = 404;
            throw err;
        }

        return mapIssueToDTO(updatedIssue);
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            const err: any = new Error("Internal server error");
            err.status = 500;
            throw err;
        }
    }
}

export const deleteIssue = async (id: string): Promise<void> => {
    const issue = await Issue.findById(id);

    if (!issue) {
        const err: any = new Error("Issue not found");
        err.status = 404;
        throw err;
    }

    await Issue.findByIdAndDelete(id);
};

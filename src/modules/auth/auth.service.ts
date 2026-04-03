import { User, UserRole } from "../../models/user.model";
import { generateToken } from "../../utils/jwt.utils";
import { AppError } from "../../utils/errors";
import { STATUS_CODE_409, STATUS_CODE_401 } from "../../utils/statusCodes";
import { MESSAGES } from "../../utils/messages";

export const registerUser = async (email: string, password: string) => {
    const existing = await User.findOne({ email });

    if (existing) {
        throw new AppError(STATUS_CODE_409, MESSAGES.AUTH.USER_ALREADY_EXISTS);
    }

    const user = await User.create({ email, password, role: UserRole.USER });

    return {
        id: user._id,
        email: user.email,
        role: user.role,
    };
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new AppError(STATUS_CODE_401, MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new AppError(STATUS_CODE_401, MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });

    return {
        token,
        id: user._id,
        email: user.email,
        role: user.role,
    };
};
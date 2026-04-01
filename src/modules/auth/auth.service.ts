import { User, UserRole } from "../../models/user.model";

export const registerUser = async (email: string, password: string) => {
    const existing = await User.findOne({ email });

    if (existing) {
        const err: any = new Error("User already exists");
        err.status = 409;
        throw err;
    }

    const user = await User.create({ email, password, role: UserRole.USER });

    return {
        id: user._id,
        email: user.email,
        role: user.role,
    };
};

export const loginUser = async (email: string, password: string) => {
    // 1. find user WITH password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        const err: any = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        const err: any = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }

    return {
        id: user._id,
        email: user.email,
        role: user.role,
    };
};
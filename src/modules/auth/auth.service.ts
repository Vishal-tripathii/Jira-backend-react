import { User, UserRole } from "../../models/user.model";

export const registerUser = async (email: string, password: string) => {
  if (!email || !password) {
    const err: any = new Error("Email and password required");
    err.status = 400;
    throw err;
  }

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
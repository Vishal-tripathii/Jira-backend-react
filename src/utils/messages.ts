/**
 * Centralized Error and Success Messages
 * Single source of truth for all user-facing messages
 */

// Authentication & Authorization Messages
export const AUTH_MESSAGES = {
  // Success
  LOGIN_SUCCESS: "Login successful",
  REGISTER_SUCCESS: "Registration successful",
  LOGOUT_SUCCESS: "Logout successful",
  
  // Errors
  UNAUTHORIZED: "Unauthorized",
  INVALID_CREDENTIALS: "Invalid credentials",
  INVALID_TOKEN: "Invalid token",
  TOKEN_EXPIRED: "Token expired",
  AUTHENTICATION_REQUIRED: "Authentication required",
  FORBIDDEN: "Forbidden",
  ACCESS_DENIED: "Access denied. Insufficient permissions",
  
  // Validation
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  EMAIL_INVALID: "Invalid email format",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
  USER_ALREADY_EXISTS: "User already exists",
} as const;

// Issue Messages
export const ISSUE_MESSAGES = {
  // Success
  CREATED: "Issue created successfully",
  UPDATED: "Issue updated successfully",
  DELETED: "Issue deleted successfully",
  
  // Errors
  NOT_FOUND: "Issue not found",
  TITLE_REQUIRED: "Title is required",
  TITLE_TOO_SHORT: "Title must be at least 3 characters",
  DESCRIPTION_REQUIRED: "Description is required",
  DESCRIPTION_TOO_SHORT: "Description must be at least 10 characters",
  INVALID_STATUS: "Invalid status",
  INVALID_PRIORITY: "Invalid priority",
  ASSIGNEE_NOT_FOUND: "Assignee not found",
} as const;

// User Messages
export const USER_MESSAGES = {
  NOT_FOUND: "User not found",
  ALREADY_EXISTS: "User already exists",
  CREATED: "User created successfully",
  UPDATED: "User updated successfully",
  DELETED: "User deleted successfully",
} as const;

// General Messages
export const GENERAL_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal server error",
  INVALID_ID_FORMAT: "Invalid ID format",
  RESOURCE_NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Validation error",
  SUCCESS: "Operation successful",
  BAD_REQUEST: "Bad request",
} as const;

// Validation Messages (dynamic)
export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field: string, max: number) => `${field} must not exceed ${max} characters`,
  INVALID_ENUM: (field: string, values: string[]) => 
    `Invalid ${field}. Must be one of: ${values.join(", ")}`,
  ALREADY_EXISTS: (field: string) => `${field} already exists`,
  MUST_BE_UNIQUE: (field: string) => `${field} must be unique`,
} as const;

// Export all messages
export const MESSAGES = {
  AUTH: AUTH_MESSAGES,
  ISSUE: ISSUE_MESSAGES,
  USER: USER_MESSAGES,
  GENERAL: GENERAL_MESSAGES,
  VALIDATION: VALIDATION_MESSAGES,
} as const;

# Error Handling Architecture

## Overview

This application uses a **centralized global error handler** with a **simple, unified approach**. All errors use a single `AppError` class with status code and message. No `try/catch` blocks needed in controllers.

---

## Architecture Flow

```
┌─────────────────────────────────────────────────┐
│ Client Request                                  │
│ POST /issue                                     │
│ Body: { assigneeId: "invalid_id" }             │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ Express Middleware Chain                        │
│ • express.json() - Parse body                   │
│ • authenticate - Verify JWT                     │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ Controller (Wrapped in asyncHandler)            │
│ • Validation (throws AppError if fails)         │
│ • Call Service Layer                            │
│ • No try/catch needed                           │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ Service Layer                                   │
│ • Business logic                                │
│ • Database operations                           │
│ • Throws AppError on failure                    │
│   ⚠️ throw new AppError(404, "Not found")       │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ asyncHandler Catches Error                      │
│ • Promise.catch(next)                           │
│ • Passes error to Express                       │
│   next(error)                                   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ Express Error Routing                           │
│ • Skips normal middleware                       │
│ • Jumps to error handler                        │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ Global Error Handler                            │
│ • Is it AppError? → Use its code & message      │
│ • Not AppError? → 500 Internal Server Error     │
│ • Log error details                             │
│ • Send response                                 │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ Client Response                                 │
│ {                                               │
│   "success": false,                             │
│   "message": "Assignee not found"               │
│ }                                               │
└─────────────────────────────────────────────────┘
```

---

## Components

### 1. Single Error Class (`src/utils/errors.ts`)

One simple class for all errors:

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}
```

**That's it. No other error classes needed.**

---

### 2. Status Code Constants (`src/utils/statusCodes.ts`)

Centralized status codes (no magic numbers):

```typescript
export const STATUS_CODE_200 = 200; // OK
export const STATUS_CODE_201 = 201; // Created
export const STATUS_CODE_400 = 400; // Bad Request
export const STATUS_CODE_401 = 401; // Unauthorized
export const STATUS_CODE_403 = 403; // Forbidden
export const STATUS_CODE_404 = 404; // Not Found
export const STATUS_CODE_409 = 409; // Conflict
export const STATUS_CODE_500 = 500; // Internal Server Error
```

---

### 3. Centralized Messages (`src/utils/messages.ts`)

All error/success messages in one place:

```typescript
export const MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: "Invalid credentials",
    USER_ALREADY_EXISTS: "User already exists",
    INVALID_TOKEN: "Invalid token",
    TOKEN_EXPIRED: "Token expired",
    // ...
  },
  ISSUE: {
    NOT_FOUND: "Issue not found",
    ASSIGNEE_NOT_FOUND: "Assignee not found",
    TITLE_TOO_SHORT: "Title must be at least 3 characters",
    // ...
  },
  // ...
};
```

---

### 4. Async Handler Wrapper (`src/utils/asyncHandler.ts`)

Eliminates `try/catch` in controllers:

```typescript
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);  // Automatically passes errors to Express
  };
};
```

---

### 5. Global Error Handler (`src/modules/middleware/errorHandler.ts`)

Ultra-simple handler:

```typescript
export const errorHandler = (err, req, res, next) => {
  let statusCode = STATUS_CODE_500;
  let message = MESSAGES.GENERAL.INTERNAL_SERVER_ERROR;

  // Handle AppError (all our errors)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Everything else is unexpected error (500)

  // Log error
  console.error("❌ Error:", {
    timestamp: new Date().toISOString(),
    message: err.message,
    statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
```

**Registered in `app.ts` (MUST be last):**
```typescript
app.use(errorHandler);
```

---

## Usage Examples

### In Services
```typescript
import { AppError } from "../../utils/errors";
import { STATUS_CODE_404, STATUS_CODE_409 } from "../../utils/statusCodes";
import { MESSAGES } from "../../utils/messages";

// Not found
if (!user) {
  throw new AppError(STATUS_CODE_404, MESSAGES.USER.NOT_FOUND);
}

// Validation
if (title.length < 3) {
  throw new AppError(STATUS_CODE_400, MESSAGES.ISSUE.TITLE_TOO_SHORT);
}

// Conflict
if (existingUser) {
  throw new AppError(STATUS_CODE_409, MESSAGES.AUTH.USER_ALREADY_EXISTS);
}

// Unauthorized
if (!token) {
  throw new AppError(STATUS_CODE_401, MESSAGES.AUTH.UNAUTHORIZED);
}
```

### In Controllers
```typescript
import { asyncHandler } from "../../utils/asyncHandler";
import { STATUS_CODE_200, STATUS_CODE_201 } from "../../utils/statusCodes";

// No try/catch needed!
export const createIssue = asyncHandler(async (req, res) => {
  const issue = await issueService.createIssue(req.body);
  
  return res.status(STATUS_CODE_201).json({
    success: true,
    data: issue,
  });
});
```

---

## Error Flow Example

### Scenario: Assignee Not Found

**Request:**
```bash
POST /issue
Body: { "assigneeId": "999999999999999999999999" }
```

**Step-by-Step:**

1. **Controller** calls `issueService.createIssue()`
2. **Service** checks: `await User.exists({ _id: assigneeId })`
3. Returns `null` → **Service throws:**
   ```typescript
   throw new AppError(STATUS_CODE_404, MESSAGES.ISSUE.ASSIGNEE_NOT_FOUND);
   ```
4. **asyncHandler** catches → calls `next(error)`
5. **Express** skips to error handler
6. **Error handler** detects `err instanceof AppError` → uses `statusCode = 404`, `message = "Assignee not found"`
7. **Logs** error details
8. **Sends response:**
   ```json
   {
     "success": false,
     "message": "Assignee not found"
   }
   ```

**HTTP Status:** `404 Not Found`

---

## Benefits

| Feature | Before | After |
|---------|--------|-------|
| **Error classes** | Multiple (NotFoundError, ValidationError, etc.) | **One (AppError)** |
| **Complexity** | High | **Minimal** |
| **Error handling** | Manual try/catch everywhere | **Automatic** |
| **Status codes** | Hardcoded numbers | **Named constants** |
| **Messages** | Scattered everywhere | **Centralized** |
| **Type safety** | `any` types | **Strong typing** |
| **Code duplication** | High | **None** |
| **Maintenance** | Change in 10+ places | **Change once** |

---

## Testing

### 1. Test 404 Error
```bash
POST /issue
Body: { "assigneeId": "000000000000000000000000" }

Expected: 404 with "Assignee not found"
```

### 2. Test Validation Error
```bash
POST /issue
Body: { "title": "ab", "description": "short" }

Expected: 400 with "Title must be at least 3 characters"
```

### 3. Test Unauthorized
```bash
POST /issue
Headers: (no Authorization header)

Expected: 401 with "Unauthorized"
```

### 4. Test Conflict
```bash
POST /auth/register
Body: { "email": "existing@example.com", "password": "password123" }

Expected: 409 with "User already exists"
```

---

## File Structure

```
src/
├── app.ts (errorHandler registered last)
├── utils/
│   ├── errors.ts          ← Single AppError class
│   ├── statusCodes.ts     ← STATUS_CODE_200, etc.
│   ├── messages.ts        ← MESSAGES.AUTH, MESSAGES.ISSUE
│   └── asyncHandler.ts    ← Wrapper for controllers
└── modules/middleware/
    └── errorHandler.ts    ← Global error handler
```

---

## Summary

**Simple. Clean. Production-ready.**

- ✅ One error class (`AppError`)
- ✅ No try/catch blocks
- ✅ Centralized messages
- ✅ Named status codes
- ✅ Automatic error handling
- ✅ Type-safe throughout
- ✅ Secure (hides internal errors)

All errors automatically flow through this system.

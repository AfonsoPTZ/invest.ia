# Error Handling Strategy

## Overview

Error handling follows a consistent pattern: **Try-Catch in Services → Error Middleware catches → Formatted Response**

---

## Error Flow

```
Controller
    ↓ (throws Error)
Service  
    ↓ (throws Error)
Repository
    ↓
Error Middleware (catches)
    ↓
Format Response + Log
    ↓
HTTP Response (JSON)
```

---

## Error Types

### 1. Validation Errors (400 Bad Request)

**When:** Input data fails validation

**Example:**
```javascript
// Invalid email format
const validation = emailValidator.validateEmail("not-an-email");
if (!validation.isValid) {
  throw new Error(validation.errors.join(", "));
}

// Response
{
  "error": "Invalid email format",
  "status": 400,
  "timestamp": "2026-03-29T10:30:00Z"
}
```

**HTTP Status:** 400

---

### 2. Authentication Errors (401 Unauthorized)

**When:** Missing or invalid JWT token

**Scenarios:**
- No Authorization header
- Token expired
- Token tampered with
- Signature invalid

**Example:**
```javascript
// In auth.middleware.js
const token = request.headers.authorization?.split(" ")[1];
if (!token) {
  throw new Error("Missing authentication token");
}

// Response
{
  "error": "Missing authentication token",
  "status": 401,
  "timestamp": "2026-03-29T10:30:00Z"
}
```

**HTTP Status:** 401

---

### 3. Permission Errors (403 Forbidden)

**When:** User authenticated but lacks permission

**Example:**
```javascript
// Email not verified → can't login
if (!user.emailVerified) {
  throw new Error("Email not verified");
}

// Response
{
  "error": "Email not verified",
  "status": 403,
  "timestamp": "2026-03-29T10:30:00Z"
}
```

**HTTP Status:** 403

---

### 4. Not Found Errors (404)

**When:** Requested resource doesn't exist

**Scenarios:**
- User doesn't exist
- Profile not found
- Route not defined

**Example:**
```javascript
// Repository
const user = await userRepository.findById(userId);
if (!user) {
  throw new Error(`User with ID ${userId} not found`);
}

// Response
{
  "error": "User with ID 123 not found",
  "status": 404,
  "timestamp": "2026-03-29T10:30:00Z"
}
```

**HTTP Status:** 404

---

### 5. Conflict Errors (409)

**When:** Data violates unique constraints

**Example:**
```javascript
// Email already registered
const emailExists = await userRepository.emailExists(email);
if (emailExists) {
  throw new Error("Email already registered");
}

// Response
{
  "error": "Email already registered",
  "status": 409,
  "timestamp": "2026-03-29T10:30:00Z"
}
```

**HTTP Status:** 409

---

### 6. Server Errors (500 Internal Server Error)

**When:** Unexpected errors in code or database

**Scenarios:**
- Database connection failed
- Unhandled exception in service
- File read error
- Third-party API failure

**Example:**
```javascript
// Database error
const [result] = await pool.query(
  "SELECT * FROM users WHERE email = ?",
  [email]
);
// If connection fails → caught as 500

// Response
{
  "error": "Internal server error",
  "status": 500,
  "timestamp": "2026-03-29T10:30:00Z"
}
```

**HTTP Status:** 500

**Note:** Stack trace hidden in production for security

---

## Error Handling in Services

### Pattern: Try-Catch with Logging

```javascript
class AuthService {
  async loginUser(email, password) {
    try {
      logger.info({ email }, "Attempting login");

      // Find user
      const user = await userRepository.findByEmail(email);
      if (!user) {
        logger.warn({ email }, "User not found");
        throw new Error("Email not found");
      }

      // Check email verified
      if (!user.emailVerified) {
        logger.warn({ email }, "Email not verified");
        throw new Error("Email not verified");
      }

      // Compare passwords
      const isPasswordValid = 
        await passwordService.comparePasswords(
          password, 
          user.passwordHash
        );
      
      if (!isPasswordValid) {
        logger.warn({ email }, "Invalid password");
        throw new Error("Invalid password");
      }

      // Generate token
      const token = await tokenService.generateToken(user);
      logger.info({ email }, "Login successful");

      return { user, token };
    } catch (error) {
      logger.error(
        { error: error.message, email }, 
        "Login failed"
      );
      throw new Error(error.message);
    }
  }
}
```

**Key points:**
- `logger.info()` - Track flow
- `logger.warn()` - User errors (not found, invalid)
- `logger.error()` - Actual errors to handle
- `throw` - Propagate to middleware
- Catch block has context (method, user, data)

---

## Error Middleware Implementation

**File:** `src/middlewares/error.middleware.js`

```javascript
const errorMiddleware = (error, request, response, next) => {
  const timestamp = new Date().toISOString();
  
  // Log error with context
  logger.error({
    error: error.message,
    stack: error.stack,
    method: request.method,
    path: request.path,
    body: request.body
  }, "Unhandled error");

  // Determine status code
  let status = 500;
  
  if (error.message.includes("not found")) {
    status = 404;
  } else if (error.message.includes("Invalid")) {
    status = 400;
  } else if (error.message.includes("Unauthorized")) {
    status = 401;
  } else if (error.message.includes("already exists")) {
    status = 409;
  }

  // Build response
  const response_body = {
    error: error.message,
    status,
    timestamp
  };

  // Include stack in development only
  if (process.env.NODE_ENV === "development") {
    response_body.stack = error.stack;
  }

  response.status(status).json(response_body);
};

module.exports = errorMiddleware;
```

---

## Validator Error Handling

**File:** `src/middlewares/validator.middleware.js`

```javascript
const validatorMiddleware = (request, response, next) => {
  const errors = validationResult(request);
  
  if (!errors.isEmpty()) {
    logger.warn(
      { errors: errors.array(), path: request.path },
      "Validation error"
    );
    
    return response.status(400).json({
      error: "Validation failed",
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      })),
      status: 400
    });
  }
  
  next();
};

module.exports = validatorMiddleware;
```

---

## 404 Not Found Handling

**File:** `src/middlewares/not-found.middleware.js`

```javascript
const notFoundMiddleware = (request, response) => {
  logger.warn(
    { method: request.method, path: request.path, ip: request.ip },
    "Route not found"
  );

  response.status(404).json({
    error: "Route not found",
    method: request.method,
    path: request.path,
    status: 404,
    timestamp: new Date().toISOString()
  });
};

module.exports = notFoundMiddleware;
```

---

## Logging Errors

**Logger calls by level:**

| Level | Use | Example |
|-------|-----|---------|
| `info` | Normal flow | `logger.info({ userId }, "User created")` |
| `warn` | User errors | `logger.warn({ email }, "Email not found")` |
| `error` | Exceptions | `logger.error({ error: err.message }, "DB failed")` |

**Always include context:**
```javascript
logger.error({
  error: error.message,
  userId: user?.id,
  email: user?.email,
  method: request.method,
  path: request.path,
  body: request.body
}, "Descriptive message");
```

---

## Custom Error Classes

### Extending Error for type safety

```javascript
// src/utils/AppError.js
class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.timestamp = new Date().toISOString();
  }
}

module.exports = AppError;
```

**Usage:**
```javascript
const AppError = require("../utils/app-error");

// Custom validation error
throw new AppError("Email already registered", 409);

// Error middleware can check
if (error instanceof AppError) {
  response.status(error.status).json({
    error: error.message,
    status: error.status,
    timestamp: error.timestamp
  });
}
```

---

## Testing Error Scenarios

### Unit Test Examples

```javascript
describe("Auth Service - Error Handling", () => {
  
  test("should throw 404 if user not found", async () => {
    stub(userRepository, "findByEmail").returns(null);
    
    expect(() => 
      authService.loginUser("notfound@test.com", "password")
    ).toThrow("Email not found");
  });

  test("should throw 403 if email not verified", async () => {
    stub(userRepository, "findByEmail").returns({
      email: "test@test.com",
      emailVerified: false
    });
    
    expect(() => 
      authService.loginUser("test@test.com", "password")
    ).toThrow("Email not verified");
  });

  test("should throw 400 if invalid email format", async () => {
    const validation = emailValidator.validateEmail("invalid");
    
    expect(validation.isValid).toBe(false);
  });
});
```

---

## Best Practices

✅ **DO:**
- Throw errors with descriptive messages
- Include context in logs (userId, email, path)
- Use appropriate HTTP status codes
- Log at controller entry/exit
- Handle database errors gracefully
- Validate before using data
- Test error scenarios

❌ **DON'T:**
- Expose stack traces in production
- Log sensitive data (passwords, tokens)
- Ignore errors silently
- Use generic "error" messages
- Mix error handling concerns
- Throw HTTP responses (use middleware)
- Expose internal system details

---

## Error Response Format

**Standard format for all errors:**

```javascript
{
  "error": "Human-readable error message",
  "status": 400,  // HTTP status code
  "timestamp": "2026-03-29T10:30:00Z",  // ISO 8601
  "stack": "Error: ..." // Only in development
}
```

**Multiple validation errors:**
```javascript
{
  "error": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "password", "message": "Minimum 8 characters required" }
  ],
  "status": 400,
  "timestamp": "2026-03-29T10:30:00Z"
}
```

---

## Common HTTP Status Codes

| Code | Reason | Use When |
|------|--------|----------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | User lacks permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Data violates unique constraint |
| 500 | Internal Server Error | Unexpected server failure |

---

## Future Improvements

- [ ] Implement error codes (E001, E002, etc.) for frontend
- [ ] Add error tracking service (Sentry, etc.)
- [ ] Create error recovery mechanisms
- [ ] Implement rate limiting for auth errors
- [ ] Add detailed audit logging for security events

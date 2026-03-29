# Routes and Middlewares

## Overview

Routes define API endpoints with middleware chains. Middlewares handle cross-cutting concerns before reaching controllers.

```
Request → Middleware Chain → Controller → Response
```

---

## Routes

### File Structure
```
src/routes/
├── auth.routes.js               # Authentication endpoints
├── financial-profile.routes.js   # Financial profile endpoints
├── dashboard.routes.js           # Dashboard endpoints
```

### Route Registration in `app.js`

```javascript
const authRoutes = require("./routes/auth.routes");
const financialProfileRoutes = require("./routes/financial-profile.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

app.use("/api/auth", authRoutes);
app.use("/api/financial-profile", financialProfileRoutes);
app.use("/api/dashboard", dashboardRoutes);
```

---

## Authentication Routes

**File:** `src/routes/auth.routes.js`

### Endpoints

#### 1. Register with OTP
```
POST /api/auth/register-with-otp
Access: Public
```
```javascript
// Request body
{
  "name": "João",
  "email": "joao@test.com",
  "cpf": "12345678901",
  "phone": "11999999999",
  "password": "Pass@123"
}

// Response 201
{
  "data": {
    "message": "User registered. Check email for OTP.",
    "userId": 1,
    "email": "joao@test.com"
  }
}
```
**Middleware chain:**
- `authValidationRules` - Express-validator rules
- `handleValidationErrors` - Check for validation errors
- `authController.registerWithOtp()` - Handle logic

#### 2. Verify Email with OTP
```
POST /api/auth/verify-email
Access: Public
```
```javascript
// Request body
{
  "userId": 1,
  "otpCode": "123456"
}

// Response 200
{
  "data": {
    "id": 1,
    "name": "João",
    "email": "joao@test.com",
    "token": "eyJhbGc..."
  }
}
```
**Middleware chain:**
- `otpValidationRules` - OTP format validation
- `handleValidationErrors`
- `authController.verifyEmail()`

#### 3. Login
```
POST /api/auth/login
Access: Public
```
```javascript
// Request body
{
  "email": "joao@test.com",
  "password": "Pass@123"
}

// Response 200
{
  "data": {
    "id": 1,
    "name": "João",
    "email": "joao@test.com",
    "token": "eyJhbGc..."
  }
}
```
**Middleware chain:**
- `loginValidationRules`
- `handleValidationErrors`
- `authController.login()`

#### 4. Resend OTP
```
POST /api/auth/resend-otp
Access: Public
```
```javascript
// Request body
{
  "email": "joao@test.com"
}

// Response 200
{
  "data": {
    "message": "OTP sent to your email"
  }
}
```
**Middleware chain:**
- `userValidationRules` - Email validation
- `handleValidationErrors`
- `authController.resendOtp()`

---

## Financial Profile Routes

**File:** `src/routes/financial-profile.routes.js`

### Endpoints

#### 1. Create Financial Profile
```
POST /api/financial-profile
Access: Protected (requires JWT token)
```
```javascript
// Request header
Authorization: Bearer eyJhbGc...

// Request body
{
  "monthly_income": 5000.00,
  "initial_balance": 1000.00,
  "has_investments": false,
  "has_assets": false,
  "financial_goal": "Save for emergency fund",
  "behavior_profile": "moderate"
}

// Response 201
{
  "data": {
    "id": 1,
    "user_id": 1,
    "monthly_income": 5000.00,
    "initial_balance": 1000.00,
    "has_investments": false,
    "has_assets": false,
    "financial_goal": "Save for emergency fund",
    "behavior_profile": "moderate"
  }
}
```
**Middleware chain:**
- `authMiddleware` - Verify JWT token
- `validatorMiddleware` - Check if data validated
- `profileValidator` - Validate financial data
- `profileController.create()`

#### 2. Get Financial Profile
```
GET /api/financial-profile
Access: Protected (requires JWT token)
```
```javascript
// Response 200
{
  "data": {
    "id": 1,
    "user_id": 1,
    "monthly_income": 5000.00,
    "initial_balance": 1000.00,
    "has_investments": false,
    "has_assets": false,
    "financial_goal": "Save for emergency fund",
    "behavior_profile": "moderate"
  }
}
```
**Middleware chain:**
- `authMiddleware`
- `profileController.getProfile()`

### Behavior Profile Enum
```
'conservative'  - Low risk, stable investments
'moderate'      - Balanced risk/return
'aggressive'    - High risk, growth-focused
```

---

## Dashboard Routes

**File:** `src/routes/dashboard.routes.js`

### Endpoints

#### 1. Get Complete Dashboard
```
GET /api/dashboard
Access: Protected (requires JWT token)
```
```javascript
// Response 200
{
  "data": {
    "user": {
      "id": 1,
      "name": "João",
      "email": "joao@test.com",
      "cpf": "12345678901",
      "phone": "11999999999"
    },
    "financialProfile": {
      "id": 1,
      "user_id": 1,
      "monthly_income": 5000.00,
      "initial_balance": 1000.00,
      "has_investments": false,
      "has_assets": false,
      "financial_goal": "Save for emergency fund",
      "behavior_profile": "moderate"
    }
  }
}
```
**Middleware chain:**
- `authMiddleware`
- `dashboardValidationMiddleware` - Check userId
- `dashboardController.getDashboard()`

#### 2. Get User Name Only
```
GET /api/dashboard/name
Access: Protected (requires JWT token)
```
```javascript
// Response 200
{
  "data": {
    "name": "João"
  }
}
```
**Middleware chain:**
- `authMiddleware`
- `dashboardController.getUserName()`

#### 3. Get Investment Data
```
GET /api/dashboard/investments
Access: Protected (requires JWT token)
```
```javascript
// Response 200
{
  "data": {
    "monthly_income": 5000.00,
    "initial_balance": 1000.00,
    "has_investments": false,
    "has_assets": false,
    "financial_goal": "Save for emergency fund",
    "behavior_profile": "moderate"
  }
}
```
**Middleware chain:**
- `authMiddleware`
- `dashboardController.getInvestments()`

---

## Middlewares

### File Structure
```
src/middlewares/
├── auth.middleware.js          # JWT validation
├── logger.middleware.js         # HTTP request/response logging
├── error.middleware.js          # Global error handler
├── not-found.middleware.js      # 404 handler
├── validator.middleware.js      # Validation result checker
```

### Application Middleware Order in `app.js`

```javascript
// 1. Logging - FIRST (captures all requests)
app.use(loggerMiddleware);

// 2. JSON parsing
app.use(express.json());

// 3. CORS
app.use(cors());

// 4. Routes
app.use("/api/auth", authRoutes);
app.use("/api/financial-profile", financialProfileRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 5. Not Found - BEFORE error handler
app.use(notFoundMiddleware);

// 6. Error Handler - LAST
app.use(errorMiddleware);
```

**Order matters!** Middlewares execute top-to-bottom.

---

## Middleware Details

### 1. `auth.middleware.js` - JWT Verification

**Purpose:** Protect routes by validating JWT token

**Flow:**
1. Extract Authorization header `Bearer <token>`
2. Verify token signature (checks if tampered)
3. Check token expiration
4. Attach decoded user to `request.user`
5. Pass to next middleware/controller

**Usage:**
```javascript
// Protect a route
router.get("/protected", authMiddleware, controller.action);
```

**On Error (401 Unauthorized):**
```javascript
{
  "error": "Invalid or expired token"
}
```

### 2. `logger.middleware.js` - HTTP Logging

**Purpose:** Log all HTTP requests and responses automatically

**Logged Info:**
- Method (GET, POST, etc.)
- URL path
- Status code
- Response time (ms)
- Client IP address
- User-Agent (browser info)

**Log Levels by Status:**
- `2xx` → INFO (success)
- `4xx` → WARN (client error)
- `5xx` → ERROR (server error)

**Example Log:**
```
[INFO] POST /api/auth/login 200 45ms 192.168.1.100
```

### 3. `error.middleware.js` - Global Error Handler

**Purpose:** Catch all errors from controllers and format responses

**Flow:**
1. Receive error object
2. Log error with full context
3. Determine HTTP status code
4. Format error response
5. Send to client

**Response Format:**
```javascript
{
  "error": "Error message here",
  "status": 400,
  "timestamp": "2026-03-29T10:30:00Z"
}
```

**For Development:** Includes stack trace  
**For Production:** Hides stack trace (security)

**Handles:**
- Validation errors (400 Bad Request)
- Not found errors (404)
- Unauthorized errors (401)
- Generic errors (500 Internal Server Error)

### 4. `not-found.middleware.js` - 404 Handler

**Purpose:** Handle requests to undefined routes

**Flow:**
1. Check if route reached this middleware
2. Log 404 attempt
3. Return structured error response

**Response:**
```javascript
{
  "error": "Route not found",
  "method": "GET",
  "path": "/api/undefined-route",
  "status": 404
}
```

### 5. `validator.middleware.js` - Validation Checker

**Purpose:** Check if express-validator found errors before reaching controller

**Flow:**
1. Check `validationResult(request)` for errors
2. If errors exist: return 400 with list of errors
3. If no errors: pass to controller

**Error Response:**
```javascript
{
  "error": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "password", "message": "Minimum 8 characters required" }
  ]
}
```

**Usage in Routes:**
```javascript
router.post("/register",
  validateRegister,           // Set validation rules
  validatorMiddleware,        // Check errors
  authController.register     // Controller (only if valid)
);
```

---

## Common Middleware Chains

### Public Route (no auth)
```javascript
router.post("/register",
  registerValidationRules,
  validatorMiddleware,
  authController.register
);
```

### Protected Route (requires auth)
```javascript
router.get("/profile",
  authMiddleware,           // ← Verify JWT
  profileController.get
);
```

### Protected + Validated
```javascript
router.post("/profile",
  authMiddleware,           // ← Verify JWT
  profileValidationRules,   // ← Set rules
  validatorMiddleware,      // ← Check errors
  profileController.create
);
```

---

## Error Handling in Routes

### Via Error Middleware

Controllers throw errors → Error middleware catches → Formatted response

```javascript
// Controller
async register(request, response) {
  try {
    throw new Error("Email already exists");
  } catch (error) {
    // Error middleware catches this
    // Format and send response
  }
}

// Error middleware
app.use(errorMiddleware);
```

### HTTP Status Codes by Error Type

| Status | Meaning | Example |
|--------|---------|---------|
| 400 | Bad Request | Invalid email format |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Email not verified |
| 404 | Not Found | User doesn't exist |
| 409 | Conflict | Email already registered |
| 500 | Server Error | Database connection failed |

---

## Adding New Routes

### Template
```javascript
const express = require("express");
const router = express.Router();

const myController = require("../controllers/my.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const myValidator = require("../validators/my.validator");

// Public route
router.post("/", 
  myValidator.validateCreate,
  myController.create
);

// Protected route
router.get("/:id",
  authMiddleware,
  myController.getById
);

module.exports = router;
```

### Register in `app.js`
```javascript
const myRoutes = require("./routes/my.routes");
app.use("/api/my-feature", myRoutes);
```

# Backend Architecture

## Doorkeeper Pattern

Each layer has one job:

```
Controller (HTTP) → Service (Orchestrator) → Validator (Data Validation) → Repository (DB)
```

| Layer | Responsibility |
|-------|-----------------|
| **Controller** | Extract request, call service, return HTTP response |
| **Service** | Validate data → Business logic → Repository access |
| **Validator** | Check if data is valid, return clean data |
| **Repository** | Database CRUD operations only |
| **Router** | HTTP middleware chain → middleware → controller |
| **Middleware** | Cross-cutting concerns (auth, logging, error handling) |

## File Structure

```
backend/src/
├── controllers/          # HTTP handlers (thin)
├── services/            # Business logic + orchestration
│   └── auth/            # Sub-services by feature
├── validators/          # Data validation rules
├── repositories/        # Database-only operations
├── middlewares/         # Authentication, logging, errors
├── routes/              # Route definitions + middleware chains
├── utils/               # Helper functions (logger, OTP generator)
├── config/              # Configuration (database)
└── server.js            # Express app setup
```

## Architecture Pattern Example: User Registration

```
POST /api/auth/register-with-otp
    ↓
authRoutes.js (chain: validationRules → validatorMiddleware → controller)
    ↓
authController.registerWithOtp()
    1. Extract name, email, cpf, phone, password
    ↓
authService.registerUserWithOtp()
    2. Call validator to check all fields
    3. Check duplicates in DB (repository query)
    4. Hash password + create user
    ↓
registerService.registerUser() (sub-service)
    5. Create user in database
    ↓
otpService.generateAndSaveOtp() (sub-service)
    6. Generate 6-digit OTP
    7. Hash OTP with bcrypt
    8. Save to database with 5-minute expiration
    ↓
emailService.sendOtpEmail() (sub-service)
    9. Send OTP via Nodemailer
    ↓
Controller returns HTTP 201 response
```

## Middleware Chain

All requests flow through:

```
1. Logger Middleware (log all requests)
2. JSON Parser (parse request body)
3. CORS (cross-origin requests)
4. Routes (route-specific middleware chains)
5. Not Found Middleware (404 handler)
6. Error Middleware (global error handler - LAST)
```

**Middleware Order matters!** Execute top-to-bottom.

## Auth Middleware

```javascript
// Protects routes by validating JWT token
authMiddleware
  ↓
1. Extract Authorization header "Bearer <token>"
2. Verify token signature
3. Check expiration
4. Attach decoded user to request.user
5. Pass to next middleware/controller
```

**Usage on protected routes:**
```javascript
router.get("/dashboard", authMiddleware, dashboardController.getDashboard);
```

## Common Middleware Chains

**Public route (no auth):**
```
validationRules → validatorMiddleware → controller
```

**Protected route (requires auth):**
```
authMiddleware → controller
```

**Protected + Validated:**
```
authMiddleware → validationRules → validatorMiddleware → controller
```

## Services Architecture

### Main Orchestrators
- **authService.js** - Coordinates login, register, logout flows
- **perfilFinanceiroService.js** - Coordinates financial profile operations

### Sub-services (services/auth/)
- **register.service.js** - User creation logic
- **login.service.js** - Login validation + token generation
- **logout.service.js** - Logout handling
- **otp.service.js** - OTP generation + verification
- **email.service.js** - Email sending (Nodemailer)
- **emailVerification.service.js** - Email verification orchestration
- **token.service.js** - JWT token generation + verification
- **password.service.js** - Password hashing + comparison

### Service Pattern

```javascript
async operationName(data) {
  try {
    logger.info("Starting operation");
    
    // 1. Validate
    // 2. Check duplicates (repository)
    // 3. Business logic
    // 4. Persist (repository)
    // 5. Return result
    
    logger.info("Operation successful");
    return result;
  } catch (error) {
    logger.error("Operation failed");
    throw error;
  }
}
```

## Validators

Pure data validation rules, no database access:

- **authValidator.js** - Login/register field validation
- **userValidator.js** - Professional libraries (cpf-cnpj-validator, libphonenumber-js)
- **otp.validator.js** - OTP format validation
- **perfilFinanceiroValidator.js** - Financial data validation

## Repositories

Database CRUD only, no business logic:

- **userRepository.js** - User table operations
- **perfilFinanceiroRepository.js** - Financial profile table operations

**Methods only:** `findByEmail()`, `create()`, `updateOtp()`, `incrementAttempts()`, etc.

## Error Handling

All errors propagate:

```
Controller/Service (throws error)
    ↓
Error middleware catches
    ↓
Logs with full context
    ↓
Determines HTTP status
    ↓
Formats response
    ↓
Sends to client
```

**HTTP Status Codes:**
| Status | Meaning | Example |
|--------|---------|---------|
| 400 | Bad Request | Invalid email format |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Email not verified |
| 404 | Not Found | User doesn't exist |
| 409 | Conflict | Email already registered |
| 500 | Server Error | Database connection failed |

## Response Format

**Success (2xx):**
```json
{
  "data": { "user": {...}, "token": "..." },
  "message": "Operation successful",
  "status": 200
}
```

**Error (4xx/5xx):**
```json
{
  "error": "Error message",
  "status": 400
}
```

## Current Structure Score

✅ **Overall: 8.5/10** - Production-ready

**All components follow:**
- Clear separation of concerns
- Single responsibility principle
- Consistent class-based patterns
- Professional validation libraries
- Structured logging throughout
- Custom error middleware

## Adding New Features

**Template for new endpoint:**

1. **Create validator:** `src/validators/feature.validator.js`
2. **Create service:** `src/services/featureService.js` + sub-services if complex
3. **Create repository:** `src/repositories/featureRepository.js` (if DB needed)
4. **Create controller:** Add method to `src/controllers/featureController.js`
5. **Create routes:** `src/routes/feature.routes.js`
6. **Register routes:** Add to `src/app.js`

**The pattern ensures:**
- Clear request flow
- Easy to test
- Easy to maintain
- Easy to scale

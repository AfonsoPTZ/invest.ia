# Authentication & Authorization

## Overview

Authentication system uses **JWT (JSON Web Tokens)** for stateless session management. After login, users receive a token that they include in API requests.

**Systems:**
- **Authentication (AuthN):** Verify who you are (via credentials)
- **Authorization (AuthZ):** Verify what you can do (via token)

---

## Authentication Flow

```
1. User enters email + password
   ↓
2. Backend validates credentials
   ↓
3. If valid → generate JWT token
   ↓
4. Return token to frontend
   ↓
5. Frontend stores token in localStorage
   ↓
6. Frontend includes token in subsequent requests
   ↓
7. Backend validates token in middleware
```

---

## JWT (JSON Web Tokens)

### Structure

JWT has 3 parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSJ9.
TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
```

**Parts:**
1. **Header:** Algorithm & token type
2. **Payload:** User data (claims)
3. **Signature:** HMAC-SHA256 signature for verification

### Token Payload

```javascript
{
  "sub": 1,              // Subject (user ID)
  "email": "user@test.com",
  "iat": 1234567890,     // Issued at (Unix timestamp)
  "exp": 1234571490,     // Expires at (Unix timestamp)
  "iss": "invest-ia",    // Issuer
  "aud": "invest-ia-app" // Audience
}
```

### Key Properties

| Property | Purpose | Value |
|----------|---------|-------|
| `sub` | User identifier | User ID (database) |
| `email` | User email | Email address |
| `iat` | Issue timestamp | Current time |
| `exp` | Expiration timestamp | iat + duration |
| `iss` | Issuer | API server name |
| `aud` | Audience | Application name |

---

## Token Service

**File:** `src/services/auth/token.service.js`

### Generate Token

```javascript
async generateToken(user) {
  try {
    const payload = {
      sub: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      iss: "invest-ia",
      aud: "invest-ia-app"
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { algorithm: "HS256" }
    );
    
    logger.info({ userId: user.id }, "Token generated");
    return token;
  } catch (error) {
    logger.error({ error: error.message }, "Token generation failed");
    throw error;
  }
}
```

**Configuration:**
- **Secret Key:** From `process.env.JWT_SECRET` (must be complex!)
- **Algorithm:** HS256 (HMAC-SHA256)
- **Expiration:** 24 hours (standard for web apps)

### Verify Token

```javascript
async verifyToken(token) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );
    
    logger.debug({ userId: decoded.sub }, "Token verified");
    return decoded;
  } catch (error) {
    logger.warn({ error: error.message }, "Token verification failed");
    throw new Error("Invalid or expired token");
  }
}
```

**Verification checks:**
- Signature validity
- Expiration time
- Secret key match

---

## Authentication Middleware

**File:** `src/middlewares/auth.middleware.js`

```javascript
const authMiddleware = (request, response, next) => {
  try {
    // Extract token from header
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      logger.warn({ path: request.path }, "Missing authorization header");
      return response.status(401).json({
        error: "Missing authorization header",
        status: 401
      });
    }
    
    // Format: "Bearer <token>"
    const parts = authHeader.split(" ");
    
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      logger.warn({ path: request.path }, "Invalid authorization format");
      return response.status(401).json({
        error: "Invalid authorization format. Use: Bearer <token>",
        status: 401
      });
    }
    
    const token = parts[1];
    
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        logger.warn({ error: error.message }, "Token verification failed");
        return response.status(401).json({
          error: "Invalid or expired token",
          status: 401
        });
      }
      
      // Attach user data to request
      request.user = {
        id: decoded.sub,
        email: decoded.email
      };
      
      logger.debug({ userId: decoded.sub }, "User authenticated");
      next();
    });
  } catch (error) {
    logger.error({ error: error.message }, "Auth middleware error");
    response.status(500).json({
      error: "Internal server error",
      status: 500
    });
  }
};

module.exports = authMiddleware;
```

**Flow:**
1. Check authorization header exists
2. Parse "Bearer <token>" format
3. Verify JWT signature
4. Extract user info
5. Attach to request.user
6. Call next() to proceed

---

## Login Service

**File:** `src/services/auth/login.service.js`

```javascript
class LoginService {
  async loginUser(email, password) {
    try {
      logger.info({ email }, "Login attempt");
      
      // 1. Find user
      const user = await userRepository.findByEmail(email);
      
      if (!user) {
        logger.warn({ email }, "Email not found");
        throw new Error("Email not found");
      }
      
      // 2. Check email verified
      if (!user.emailVerified) {
        logger.warn({ email }, "Email not verified");
        throw new Error("Email not verified. Please verify your email.");
      }
      
      // 3. Verify password
      const isPasswordValid = await passwordService.comparePasswords(
        password,
        user.passwordHash
      );
      
      if (!isPasswordValid) {
        logger.warn({ email }, "Invalid password");
        throw new Error("Invalid password");
      }
      
      // 4. Generate token
      const token = await tokenService.generateToken(user);
      
      logger.info({ userId: user.id, email }, "Login successful");
      
      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName
        },
        token
      };
    } catch (error) {
      logger.error({ error: error.message, email }, "Login failed");
      throw error;
    }
  }
}

module.exports = new LoginService();
```

**Validations:**
1. User exists
2. Email verified
3. Password correct

**Returns:**
- User object (no sensitive data)
- JWT token

---

## Logout Service

**File:** `src/services/auth/logout.service.js`

```javascript
class LogoutService {
  async logoutUser(userId) {
    try {
      logger.info({ userId }, "User logout");
      
      // JWT is stateless, no server-side logout needed
      // Frontend just discards the token
      
      // (Optional) Could track logged-out tokens for extra security:
      // await tokenBlacklistRepository.addToken(token, expiration);
      
      return { message: "Logged out successfully" };
    } catch (error) {
      logger.error({ error: error.message, userId }, "Logout failed");
      throw error;
    }
  }
}

module.exports = new LogoutService();
```

**Note:** JWT logout is simple because tokens are stateless. Frontend just deletes the token.

**Future enhancement:** Could implement token blacklist for immediate logout revocation.

---

## Password Service

**File:** `src/services/auth/password.service.js`

### Hash Password

```javascript
async hashPassword(plainPassword) {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
  } catch (error) {
    logger.error({ error: error.message }, "Password hashing failed");
    throw error;
  }
}
```

**Bcrypt properties:**
- Salt rounds: 10 (cryptographically secure)
- One-way hash (can't decrypt)
- Different hash each time (random salt)

### Compare Password

```javascript
async comparePasswords(plainPassword, hash) {
  try {
    const isValid = await bcrypt.compare(plainPassword, hash);
    return isValid;
  } catch (error) {
    logger.error({ error: error.message }, "Password comparison failed");
    throw error;
  }
}
```

**Prevents timing attacks:** bcrypt comparison time is constant regardless of match

---

## Login Controller

**File:** `src/controllers/authController.js`

```javascript
async login(request, response, next) {
  try {
    const { email, password } = request.body;
    
    logger.info({ email }, "Login request");
    
    // Validate input
    const validation = authValidator.validateLogin(email, password);
    if (!validation.isValid) {
      return response.status(400).json({
        error: validation.errors.join(", "),
        status: 400
      });
    }
    
    // Login user
    const { user, token } = await loginService.loginUser(email, password);
    
    // Set secure HTTP-only cookie
    response.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    logger.info({ userId: user.id }, "Login successful");
    
    response.status(200).json({
      message: "Login successful",
      user,
      token, // Also return token for localStorage (optional)
      status: 200
    });
  } catch (error) {
    logger.error({ error: error.message }, "Login failed");
    next(error);
  }
}
```

**Response includes:**
- Token (put in Authorization header)
- User data (for frontend state)
- Message (for UX feedback)

---

## Logout Controller

```javascript
async logout(request, response, next) {
  try {
    const userId = request.user.id;
    
    logger.info({ userId }, "Logout request");
    
    // Call logout service
    await logoutService.logoutUser(userId);
    
    // Clear cookie
    response.clearCookie("token");
    
    logger.info({ userId }, "Logout successful");
    
    response.status(200).json({
      message: "Logged out successfully",
      status: 200
    });
  } catch (error) {
    logger.error({ error: error.message }, "Logout failed");
    next(error);
  }
}
```

---

## Frontend Authentication

**File:** `src/services/authService.js`

### Store Token

```javascript
const authService = {
  // Save token after login
  setToken(token) {
    localStorage.setItem("authToken", token);
  },
  
  // Get token for API calls
  getToken() {
    return localStorage.getItem("authToken");
  },
  
  // Remove token on logout
  clearToken() {
    localStorage.removeItem("authToken");
  }
};
```

### API Calls with Token

```javascript
// In every API request, add Authorization header
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = authService.getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  return response.json();
};
```

### Login Endpoint

```javascript
async login(email, password) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    authService.setToken(data.token);
    return data.user;
  }
  
  throw new Error(data.error);
}
```

### Logout Endpoint

```javascript
async logout() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${authService.getToken()}`
    }
  });
  
  if (response.ok) {
    authService.clearToken();
    navigate("/auth/login");
  }
}
```

---

## Auth Routes

**File:** `src/routes/authRoutes.js`

```javascript
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth.middleware");

// Public routes (no auth required)
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOtp);

// Protected routes (auth required)
router.post("/logout", authMiddleware, authController.logout);
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;
```

---

## Protected Routes

To protect a route, use `authMiddleware`:

```javascript
// Routes that require authentication
router.get("/api/perfil-financeiro", 
  authMiddleware,  // ← Check authentication
  perfilFinanceiroController.getAllProfiles
);

router.post("/api/perfil-financeiro",
  authMiddleware,  // ← Check authentication
  validatorMiddleware,
  perfilFinanceiroController.createProfile
);
```

**If user not authenticated:**
- Status: 401 Unauthorized
- Error: "Invalid or expired token"

---

## Environment Variables

**File:** `.env`

```ini
# JWT Configuration
JWT_SECRET=your_super_secret_key_min_32_chars_xxxxxxxxxxxxxxxxxxxxxxxx
JWT_EXPIRES_IN=24h

# Email Configuration (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server
PORT=3000
NODE_ENV=development
DATABASE_URL=mysql://user:password@localhost:3306/invest_ia
```

**⚠️ Security:**
- Never commit `.env` file
- Make `JWT_SECRET` at least 32 characters
- Use strong, random secret (not "secretkey")
- Use App Password for Gmail, not account password

---

## Token Refresh (Future Enhancement)

Current system uses fixed 24-hour expiration. For better UX, implement refresh tokens:

```javascript
// Long-lived token to get new access tokens
// Would need separate endpoint: POST /api/auth/refresh
async refreshToken(refreshToken) {
  // Verify refresh token
  // Generate new access token
  // Return new token
}
```

---

## Security Best Practices

✅ **DO:**
- Use HTTPS in production
- Keep JWT_SECRET secure and long
- Set short token expiration (24h)
- Validate token in every protected endpoint
- Include CORS headers appropriately
- Hash passwords with bcrypt
- Log auth attempts

❌ **DON'T:**
- Store tokens in cookies without httpOnly flag
- Expose JWT_SECRET in code or .env version control
- Use weak passwords or defaults
- Skip email verification
- Trust client-side validation alone
- Expose user ID in token payload if sensitive
- Log sensitive data (passwords, tokens)

---

## Testing Authentication

### Backend Unit Tests

```javascript
describe("Auth Service", () => {
  
  test("should login with valid credentials", async () => {
    const result = await loginService.loginUser(
      "test@test.com",
      "password123"
    );
    
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe("test@test.com");
  });

  test("should fail login if email not found", async () => {
    expect(() =>
      loginService.loginUser("notfound@test.com", "password")
    ).toThrow("Email not found");
  });

  test("should fail login if email not verified", async () => {
    // User exists but emailVerified = false
    expect(() =>
      loginService.loginUser("unverified@test.com", "password")
    ).toThrow("Email not verified");
  });

  test("should fail login with wrong password", async () => {
    expect(() =>
      loginService.loginUser("test@test.com", "wrongpassword")
    ).toThrow("Invalid password");
  });
});
```

### Frontend Integration Tests

```javascript
describe("Auth Flow", () => {
  
  test("should login and store token", async () => {
    const user = await authService.login(
      "test@test.com",
      "password123"
    );
    
    expect(localStorage.getItem("authToken")).toBeDefined();
    expect(user.email).toBe("test@test.com");
  });

  test("should add token to API requests", async () => {
    authService.setToken("test-token");
    
    const request = await makeAuthenticatedRequest("/api/users");
    
    expect(request.headers.Authorization).toBe("Bearer test-token");
  });

  test("should logout and clear token", async () => {
    authService.setToken("test-token");
    await authService.logout();
    
    expect(localStorage.getItem("authToken")).toBeNull();
  });
});
```

---

## API Reference

### Register Endpoint

**POST** `/api/auth/register`

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success):**
```json
{
  "message": "Registration successful. OTP sent to email.",
  "email": "john@example.com",
  "status": 201
}
```

---

### Login Endpoint

**POST** `/api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "fullName": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "status": 200
}
```

---

### Verify OTP Endpoint

**POST** `/api/auth/verify-otp`

**Request:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "message": "Email verified successfully",
  "status": 200
}
```

---

### Logout Endpoint

**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success):**
```json
{
  "message": "Logged out successfully",
  "status": 200
}
```

---

## Common Issues

### Token Expired

**Error:** "Invalid or expired token"

**Solution:** User needs to login again → Get new token

### Invalid Token Format

**Error:** "Invalid authorization format. Use: Bearer <token>"

**Solution:** Ensure header format is exactly: `Authorization: Bearer <token>`

### Email Not Verified

**Error:** "Email not verified. Please verify your email."

**Solution:** User must verify OTP first before logging in

### Wrong Password

**Error:** "Invalid password"

**Solution:** Check password is correct (case-sensitive)

---

## Summary

- **Registration:** Email + Password → User created (emailVerified=false) → OTP sent
- **Email Verification:** OTP → Email verified → Can login
- **Login:** Email + Password → JWT token returned
- **Protected Endpoints:** Require "Authorization: Bearer <token>" header
- **Logout:** Frontend deletes token
- **Token Expiration:** 24 hours (can be adjusted)
- **Security:** HTTPS, httpOnly cookies, bcrypt passwords, JWT signature

# Authentication System

## Overview

Complete auth system with JWT tokens and email verification (OTP).

```
Registration → Email Verification (OTP) → Login → JWT Token → Protected Routes
```

## Authentication Flow

### 1. User Registration with OTP

**Endpoint:** `POST /api/auth/register-with-otp`

```json
// Request
{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678901",
  "phone": "11999999999",
  "password": "SecurePass@123"
}

// Response 201
{
  "data": {
    "message": "User registered. Check your email for OTP code.",
    "userId": 1,
    "email": "joao@example.com"
  }
}
```

**Flow:**
1. Controller validates input
2. Service checks if email/cpf/phone already exist
3. Service hashes password with bcrypt
4. Service creates user in database (emailVerified = false)
5. Service generates 6-digit OTP
6. OTP hashed with bcrypt (never plaintext)
7. OTP sent via email (Nodemailer)
8. Return userId + email

### 2. Email Verification with OTP

**Endpoint:** `POST /api/auth/verify-email`

```json
// Request
{
  "userId": 1,
  "otpCode": "123456"
}

// Response 200
{
  "data": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Flow:**
1. Controller validates request
2. Service fetches user by ID
3. Service checks if OTP expired (5 minute window)
4. Service compares OTP with stored hash (bcrypt)
5. Service increments attempt counter
6. If 3 failed attempts → lock for 15 minutes
7. On success: mark email as verified + clear OTP
8. Generate JWT token
9. Return user + token

**OTP Rules:**
- Length: 6 digits
- Expiration: 5 minutes
- Max attempts: 3
- Lockout: 15 minutes after exceeded attempts

### 3. Login

**Endpoint:** `POST /api/auth/login`

```json
// Request
{
  "email": "joao@example.com",
  "password": "SecurePass@123"
}

// Response 200
{
  "data": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// Error if email not verified (403)
{
  "error": "Email not verified. Check your inbox for OTP code."
}
```

**Flow:**
1. Controller validates email + password
2. Service finds user by email
3. Service checks if email is verified (must be verified to login)
4. Service compares password with stored hash (bcrypt)
5. Service generates JWT token
6. Return user + token

### 4. Logout

**Endpoint:** `POST /api/auth/logout`

```
Headers: Authorization: Bearer <token>

Response 200
{
  "message": "Logged out successfully"
}
```

**Flow:**
1. Frontend deletes JWT from localStorage
2. Optional: Backend could track blacklisted tokens (future enhancement)

## JWT (JSON Web Tokens)

### Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSJ9.
TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ

Header . Payload . Signature
```

**Parts:**
1. **Header:** Algorithm (HS256) & token type (JWT)
2. **Payload:** User claims (id, email, iat, exp)
3. **Signature:** HMAC-SHA256 verification

### Token Payload

```javascript
{
  "sub": 1,              // User ID
  "email": "user@test.com",
  "iat": 1234567890,     // Issued at (Unix timestamp)
  "exp": 1234571490,     // Expires at (1 hour from now)
  "iss": "invest-ia",    // Issuer
  "aud": "invest-ia-app" // Audience
}
```

### Token Lifecycle

1. **Generated** after successful login or email verification
2. **Stored** by frontend in localStorage
3. **Sent** with every API request: `Authorization: Bearer <token>`
4. **Validated** by auth middleware on protected routes
5. **Expires** after 1 hour (configurable in JWT_EXPIRATION)
6. **Refreshed** by logging in again

## Services

### Token Service (`src/services/auth/token.service.js`)

**Generate Token:**
```javascript
async generateToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60),  // 1 hour
    iss: "invest-ia",
    aud: "invest-ia-app"
  };
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: "HS256" });
  return token;
}
```

**Verify Token:**
```javascript
async verifyToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  return decoded;
}
```

**Configuration:**
- Secret: From `process.env.JWT_SECRET` (must be 32+ chars)
- Algorithm: HS256 (HMAC-SHA256)
- Expiration: 1 hour (configurable)

### Login Service (`src/services/auth/login.service.js`)

```javascript
async loginUser(email, password) {
  // 1. Find user
  const user = await userRepository.findByEmail(email);
  
  // 2. Check email verified
  if (!user.emailVerified) {
    throw new Error("Email not verified");
  }
  
  // 3. Verify password
  const isValid = await passwordService.comparePasswords(password, user.passwordHash);
  
  // 4. Generate token
  const token = await tokenService.generateToken(user);
  
  return { user, token };
}
```

### Password Service (`src/services/auth/password.service.js`)

**Hash Password:**
```javascript
async hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, 10);  // 10 salt rounds
}
```

**Compare Password:**
```javascript
async comparePasswords(plainPassword, hash) {
  return await bcrypt.compare(plainPassword, hash);
}
```

**Bcrypt properties:**
- One-way hash (can't decrypt)
- Different hash each time (random salt)
- Timing-attack resistant
- Standard for password hashing

## Authentication Middleware

**File:** `src/middlewares/auth.middleware.js`

```javascript
const authMiddleware = (request, response, next) => {
  try {
    // 1. Extract token from header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).json({ error: "Missing authorization header" });
    }
    
    // 2. Check "Bearer" format
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return response.status(401).json({ error: "Invalid authorization format" });
    }
    
    const token = parts[1];
    
    // 3. Verify token
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return response.status(401).json({ error: "Invalid or expired token" });
      }
      
      // 4. Attach user to request
      request.user = { id: decoded.sub, email: decoded.email };
      next();
    });
  } catch (error) {
    response.status(500).json({ error: "Internal server error" });
  }
};
```

**Usage on protected routes:**
```javascript
router.get("/dashboard", authMiddleware, dashboardController.getDashboard);
```

## Frontend Token Management

**File:** `src/services/authService.js`

### Store Token
```javascript
export function setToken(token) {
  localStorage.setItem("token", token);
}
```

### Get Token
```javascript
export function getToken() {
  return localStorage.getItem("token");
}
```

### Clear Token
```javascript
export function clearToken() {
  localStorage.removeItem("token");
}
```

### Add to API Requests
```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(url, { ...options, headers });
  return response.json();
}
```

## Environment Variables

**Required in `.env`:**

```ini
# JWT Configuration
JWT_SECRET=your_super_secret_key_min_32_chars_xxxxxxxxxxxxxxxxxxxxxxxx
JWT_EXPIRATION=1h

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server
PORT=3000
NODE_ENV=development
DATABASE_URL=mysql://user:password@localhost:3306/invest_ia
```

**⚠️ Security Notes:**
- Never commit `.env` file
- JWT_SECRET must be at least 32 characters
- Use strong, random secret (not "secretkey")
- Use Gmail App Password, not account password

## Protected Routes Example

```javascript
// Requires authentication
router.get("/api/financial-profile", 
  authMiddleware,  // ← Check JWT token first
  financialProfileController.getProfile
);

router.post("/api/financial-profile",
  authMiddleware,  // ← Check JWT token first
  validationRules,
  validatorMiddleware,
  financialProfileController.createProfile
);
```

**If user not authenticated:**
- Status: 401 Unauthorized
- Error: "Invalid or expired token"

## Database Schema

**users table:**

```sql
id                  INT PRIMARY KEY AUTO_INCREMENT
name                VARCHAR(150) NOT NULL
email               VARCHAR(150) NOT NULL UNIQUE
cpf                 CHAR(11) NOT NULL UNIQUE
phone               VARCHAR(20) NOT NULL UNIQUE
password_hash       VARCHAR(255) NOT NULL
email_verified      BOOLEAN DEFAULT FALSE
otp_code_hash       VARCHAR(255) NULL
otp_expires_at      DATETIME NULL
otp_attempts        INT DEFAULT 0
created_at          DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP
```

## Security Best Practices

✅ **Implemented:**
- Passwords hashed with bcrypt (salt: 10)
- OTP stored as bcrypt hash (never plaintext)
- JWT signed with strong secret
- Email verification before login access
- OTP rate limiting (3 attempts → 15min lockout)
- CORS middleware configured
- Input sanitization via validators

⚠️ **For Production:**
- Use HTTPS only (secure: true in cookies)
- Implement token refresh rotation
- Add IP-based rate limiting
- Store JWT_SECRET in secrets vault (not .env)
- Enable 2FA (two-factor authentication)
- Add audit logging for sensitive operations

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid or expired token" | Token expired | User needs to login again |
| "Invalid authorization format" | Wrong header format | Use `Authorization: Bearer <token>` |
| "Email not verified" | User didn't verify OTP | User must verify OTP first |
| "Invalid password" | Wrong password | Check password is correct |
| "Email already registered" | Duplicate email | Use different email |

## API Reference

### Register Endpoint
**POST** `/api/auth/register-with-otp`
**Access:** Public

### Verify Email Endpoint
**POST** `/api/auth/verify-email`
**Access:** Public

### Login Endpoint
**POST** `/api/auth/login`
**Access:** Public

### Logout Endpoint
**POST** `/api/auth/logout`
**Access:** Protected (requires JWT)

### Protected Route Pattern
**Any Route**
**Headers:** `Authorization: Bearer <jwt_token>`
**Access:** Protected (requires JWT)

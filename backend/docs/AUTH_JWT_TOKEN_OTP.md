# Authentication, JWT, Tokens & OTP

## Overview

The authentication system combines JWT tokens with email verification via OTP (One-Time Password).

```
User Registration → Email Verification (OTP) → Login → JWT Token → Protected Routes
```

---

## Authentication Flow

### 1. User Registration with Email Verification

**Endpoint:** `POST /api/auth/register-with-otp`

```javascript
// Request
{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678901",
  "phone": "11999999999",
  "password": "SecurePass@123"
}

// Response (201 Created)
{
  "data": {
    "message": "User registered. Check your email for OTP code.",
    "userId": 1,
    "email": "joao@example.com"
  }
}
```

**Flow:**
1. Controller validates request with RegisterDTO
2. Service checks if email/cpf/phone already exist
3. Service hashes password with bcrypt
4. Service creates user in database
5. Service generates 6-digit OTP code
6. Service hashes OTP with bcrypt (never store plaintext)
7. Service sends OTP via email (Nodemailer)
8. User receives email with code

---

### 2. Email Verification with OTP

**Endpoint:** `POST /api/auth/verify-email`

```javascript
// Request
{
  "userId": 1,
  "otpCode": "123456"
}

// Response (200 OK)
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
1. Controller validates request with VerifyOtpDTO
2. Service fetches user by ID
3. Service checks if OTP expired (5 minute window)
4. Service compares OTP attempt with stored hash
5. Service increments attempt counter
6. If 3 failed attempts → lock for 15 minutes
7. On success: mark email as verified
8. Service generates JWT token
9. Return user data + token

**OTP Rules:**
- Length: 6 digits
- Expiration: 5 minutes
- Max attempts: 3
- Lockout duration: 15 minutes after exceeded attempts

---

### 3. Login

**Endpoint:** `POST /api/auth/login`

```javascript
// Request
{
  "email": "joao@example.com",
  "password": "SecurePass@123"
}

// Response (200 OK)
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
1. Controller validates request with LoginDTO
2. Service finds user by email
3. Service compares password with stored hash (bcrypt)
4. Service checks if email is verified
5. Service generates JWT token
6. Return user data + token

---

## JWT Token System

### Token Structure

**Header:**
```javascript
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```javascript
{
  "userId": 1,
  "email": "joao@example.com",
  "iat": 1711000000,      // issued at
  "exp": 1711003600       // expires in 1 hour
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  process.env.JWT_SECRET
)
```

### Token Lifecycle

1. **Generated** after successful login or email verification
2. **Stored** by frontend in localStorage
3. **Sent** with every API request in Authorization header
4. **Validated** by `auth.middleware.js` on protected routes
5. **Expired** after 1 hour (configurable)

### Token Usage

**In HTTP Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Extracted by auth.middleware:**
```javascript
const token = request.headers.authorization?.split(" ")[1];
// Verifies token signature and expiration
// Attaches user info to request.user
```

---

## Services Architecture

### `src/services/auth/` Sub-services

#### 1. `register.service.js` - User Creation
```javascript
async registerUser(name, email, cpf, phone, password) {
  // 1. Validate all fields via userValidator
  // 2. Check duplicates (email, cpf, phone)
  // 3. Hash password with bcrypt
  // 4. Create user in database
  // 5. Generate OTP
  // 6. Send verification email
  return user;
}
```

#### 2. `otp.service.js` - OTP Management
```javascript
async generateAndSaveOtp(userId) {
  // 1. Generate 6-digit random code
  // 2. Hash with bcrypt
  // 3. Set expiration (5 minutes from now)
  // 4. Save to database
  // 5. Return plaintext code for email
}

async verifyOtp(userId, providedCode) {
  // 1. Fetch user + OTP from database
  // 2. Check if expired
  // 3. Compare codes
  // 4. Increment attempts if failed
  // 5. Throw error if maxed attempts
  // 6. Clear OTP on success
}

async incrementOtpAttempts(userId) {
  // 1. Increment attempt counter
  // 2. Check if >= 3
  // 3. If maxed: set 15min lockout
}

async markEmailAsVerified(userId) {
  // 1. Set email_verified = true
  // 2. Clear OTP data
}
```

#### 3. `email.service.js` - Email Sending
```javascript
async sendOtpEmail(email, code) {
  // Uses Nodemailer to send:
  // - Subject: "Verify your email"
  // - Body: HTML template with 6-digit code
}

async sendVerificationSuccessEmail(email) {
  // Sends confirmation after email verified
}
```

#### 4. `email-verification.service.js` - OTP Flow Orchestrator
```javascript
async verifyEmailWithOtp(userId, otpCode) {
  // 1. Call otp.service.verifyOtp()
  // 2. Call otp.service.markEmailAsVerified()
  // 3. Call token.service.generateToken()
  // 4. Call email.service.sendVerificationSuccessEmail()
  return { user, token };
}
```

#### 5. `token.service.js` - JWT Generation
```javascript
async generateToken(user) {
  // 1. Create payload { userId, email }
  // 2. Sign with JWT secret
  // 3. Set expiration 1 hour
  return token;
}

async verifyToken(token) {
  // 1. Verify signature
  // 2. Check expiration
  // 3. Return decoded payload
}
```

#### 6. `login.service.js` - Login Logic
```javascript
async loginUser(email, password) {
  // 1. Find user by email
  // 2. Check if email verified
  // 3. Compare password hashes
  // 4. Generate JWT token
  return { user, token };
}
```

#### 7. `password.service.js` - Password Management
```javascript
async hashPassword(plainPassword) {
  // Bcrypt hash with salt 10
}

async comparePasswords(plainPassword, hash) {
  // Bcrypt compare
}
```

#### 8. `verify-email.service.js` - Resend OTP
```javascript
async resendVerificationCode(userId) {
  // 1. Fetch user
  // 2. Generate new OTP
  // 3. Send email again
}
```

#### 9. `logout.service.js` - Logout
```javascript
async logout(userId) {
  // Optional: backend-side token blacklist
  // Current: frontend deletes localStorage
}
```

---

## Middleware: Authentication

### `src/middlewares/auth.middleware.js`

**Purpose:** Extract and validate JWT token from request

**Usage:** Applied to protected routes (dashboard, financial-profile)

```javascript
// Attached to route
router.get("/profile", authMiddleware, profileController.getProfile);

// Validates:
// 1. Authorization header exists
// 2. "Bearer" scheme present
// 3. Token valid (signature + expiration)
// 4. Adds request.user = { userId, email }
```

**On Error (401 Unauthorized):**
- Missing token
- Invalid signature
- Expired token
- Malformed header

---

## Environment Variables

**Required in `.env`:**
```
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRATION=1h

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

NODE_ENV=development
LOG_LEVEL=info
```

---

## Database Schema

### `users` Table
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
updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

---

## Security Best Practices

✅ **Implemented:**
- Password hashing with bcrypt (salt rounds: 10)
- OTP stored as bcrypt hash (never plaintext)
- JWT signed with strong secret
- Email verification before full access
- OTP rate limiting (3 attempts → 15min lockout)
- CORS middleware to restrict origins
- Input sanitization via validators

⚠️ **For Production:**
- Use HTTPS only (secure: true in cookies)
- Implement token refresh rotation
- Add IP-based rate limiting
- Store JWT_SECRET in secrets vault (not .env)
- Implement token blacklist for logout
- Add audit logging for sensitive operations
- Enable 2FA (two-factor authentication)

# Email Verification with OTP

## Overview

Email verification system using One-Time Password (OTP). After registration, users receive a 6-digit OTP to verify their email before gaining full access.

```
1. User registers
   ↓
2. OTP generated (6 digits)
   ↓
3. OTP sent via email
   ↓
4. OTP hashed and stored (5 min expiry)
   ↓
5. User enters OTP in frontend
   ↓
6. OTP validated
   ↓
7. Email marked verified
   ↓
8. User can now login
```

## OTP Generation

**File:** `src/utils/generateOtp.js`

```javascript
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
```

**Properties:**
- 6-digit number (100000-999999)
- Random generation
- Human-friendly (easy to type)

## OTP Service

**File:** `src/services/auth/otp.service.js`

### Generating OTP

```javascript
async generateOtpForEmail(email) {
  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);  // 5 minutes
  
  await userRepository.updateOtp(email, {
    otpHash: hashedOtp,
    otpExpiresAt: expiresAt,
    otpAttempts: 0
  });
  
  logger.info({ email }, "OTP generated");
  return otp;  // Return plaintext for email
}
```

**Key:**
- OTP hashed before storage (security best practice)
- 5-minute expiration
- Uses bcrypt (same as passwords)

### Verifying OTP

```javascript
async verifyOtp(email, providedOtp) {
  const user = await userRepository.findByEmail(email);
  
  // Check expiration
  if (new Date() > user.otpExpiresAt) {
    throw new Error("OTP expired");
  }
  
  // Check attempts
  if (user.otpAttempts >= 3) {
    throw new Error("Max attempts exceeded");
  }
  
  // Compare OTP
  const isValid = await bcrypt.compare(providedOtp, user.otpHash);
  
  if (!isValid) {
    await userRepository.incrementOtpAttempts(email);
    throw new Error("Invalid OTP");
  }
  
  logger.info({ email }, "OTP verified");
  return true;
}
```

**Verifications:**
- Not expired
- Within attempt limits (max 3)
- Correct code

## Email Service

**File:** `src/services/auth/email.service.js`

### Sending OTP Email

```javascript
async sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification - Invest.IA",
    html: `
      <h2>Welcome to Invest.IA</h2>
      <p>Your verification code is:</p>
      <h1 style="font-size: 32px; letter-spacing: 5px;">
        ${otp}
      </h1>
      <p>This code expires in 5 minutes.</p>
      <p>If you didn't request this, please ignore.</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
  logger.info({ email }, "OTP email sent");
}
```

**Email Features:**
- Gmail SMTP (configured in .env)
- HTML template for better UX
- Code formatted for easy reading
- Expiration warning

## Email Verification Service

**File:** `src/services/auth/emailVerification.service.js`

### Mark Email as Verified

```javascript
async markEmailAsVerified(email) {
  await userRepository.updateUser(email, {
    emailVerified: true,
    otpHash: null,        // Clear OTP
    otpExpiresAt: null,   // Clear expiration
    otpAttempts: 0
  });
  
  logger.info({ email }, "Email verified");
}
```

### Complete Verification Flow

```javascript
async verifyEmailWithOtp(userId, otpCode) {
  // 1. Verify OTP
  await otpService.verifyOtp(userId, otpCode);
  
  // 2. Mark email verified
  await markEmailAsVerified(userId);
  
  // 3. Send confirmation email
  await emailService.sendVerificationSuccessEmail(userId);
  
  // 4. Generate JWT token
  const token = await tokenService.generateToken(userId);
  
  return { token };
}
```

## OTP Validator

**File:** `src/validators/otp.validator.js`

```javascript
const otpValidator = {
  validateOtp(otp) {
    const errors = [];
    
    if (!otp) {
      errors.push("OTP is required");
    }
    
    if (!/^\d{6}$/.test(otp)) {
      errors.push("OTP must be exactly 6 digits");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
```

## Controller Implementation

**File:** `src/controllers/authController.js`

### Verify Email Endpoint

```javascript
async verifyEmail(request, response, next) {
  try {
    const { userId, otpCode } = request.body;
    
    // 1. Validate OTP format
    const validation = otpValidator.validateOtp(otpCode);
    if (!validation.isValid) {
      return response.status(400).json({
        error: validation.errors.join(", ")
      });
    }
    
    // 2. Verify OTP
    const { token } = await emailVerificationService.verifyEmailWithOtp(userId, otpCode);
    
    logger.info({ userId }, "Email verified");
    
    response.status(200).json({
      data: { token, message: "Email verified successfully" }
    });
  } catch (error) {
    next(error);
  }
}
```

### Resend OTP Endpoint

```javascript
async resendOtp(request, response, next) {
  try {
    const { email } = request.body;
    
    // 1. Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    
    // 2. Generate new OTP
    const otp = await otpService.generateOtpForEmail(email);
    
    // 3. Send email
    await emailService.sendOtpEmail(email, otp);
    
    logger.info({ email }, "OTP resent");
    
    response.status(200).json({
      data: { message: "OTP sent to your email" }
    });
  } catch (error) {
    next(error);
  }
}
```

## Routes

**File:** `src/routes/auth.routes.js`

```javascript
router.post("/register-with-otp", 
  authValidator.registerValidation,
  validatorMiddleware,
  authController.registerWithOtp
);

router.post("/verify-email",
  otpValidator.validateOtp,
  validatorMiddleware,
  authController.verifyEmail
);

router.post("/resend-otp",
  authValidator.emailValidation,
  validatorMiddleware,
  authController.resendOtp
);
```

## API Endpoints

### Register with OTP
**POST** `/api/auth/register-with-otp`

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

### Verify Email with OTP
**POST** `/api/auth/verify-email`

```json
// Request
{
  "userId": 1,
  "otpCode": "123456"
}

// Response 200
{
  "data": {
    "message": "Email verified successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// Error - Invalid OTP (400)
{
  "error": "Invalid OTP"
}

// Error - Expired OTP (400)
{
  "error": "OTP expired"
}

// Error - Max attempts (403)
{
  "error": "Max attempts exceeded. Try again in 15 minutes."
}
```

### Resend OTP
**POST** `/api/auth/resend-otp`

```json
// Request
{
  "email": "joao@example.com"
}

// Response 200
{
  "data": {
    "message": "OTP sent to your email"
  }
}
```

## Database Schema

**users table (relevant columns):**

```sql
email_verified      BOOLEAN DEFAULT FALSE
otp_code_hash       VARCHAR(255) NULL
otp_expires_at      DATETIME NULL
otp_attempts        INT DEFAULT 0
```

**Migrations:**

```sql
ALTER TABLE usuarios ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE usuarios ADD COLUMN otp_code_hash VARCHAR(255) NULL;
ALTER TABLE usuarios ADD COLUMN otp_expires_at DATETIME NULL;
ALTER TABLE usuarios ADD COLUMN otp_attempts INT NOT NULL DEFAULT 0;
```

## Environment Variables

**Required in `.env`:**

```ini
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

OTP_EXPIRATION_MINUTES=5
OTP_MAX_ATTEMPTS=3
OTP_LOCKOUT_MINUTES=15
```

## Frontend Integration

**File:** `src/pages/auth/Register.jsx`

1. User fills registration form (name, email, cpf, phone, password)
2. Calls `POST /api/auth/register-with-otp`
3. Redirects to OTP verification page

**File:** `src/pages/auth/VerifyOtp.jsx`

1. User enters 6-digit OTP
2. Auto-focus between digit inputs
3. Calls `POST /api/auth/verify-email`
4. On success: stores token + redirects to financial-profile
5. Resend OTP available if expired (30s cooldown)

## Security Features

✅ **Implemented:**
- OTP hashed with bcrypt (never plaintext in DB)
- 5-minute expiration (prevents replay attacks)
- Rate limiting: 3 attempts → 15 minute lockout
- Hash comparison prevents timing attacks
- Email verification required before login
- Brute force protection

⚠️ **Future Enhancements:**
- SMS OTP (more secure than email)
- Backup codes for recovery
- 2FA for high-risk changes
- IP-based rate limiting
- Email domain validation

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| OTP email not received | Email service misconfiguration | Check .env EMAIL_* variables |
| OTP keeps expiring | User takes too long | Increase OTP_EXPIRATION_MINUTES to 10-15 |
| "Max attempts exceeded" | User entered wrong OTP 3 times | Wait 15 minutes or request new OTP |
| "Invalid OTP" | User entered wrong code | Double-check code from email |
| Gmail app password error | Regular Gmail password used | Generate App Password in Gmail settings |

## Testing OTP Flow

1. **Register:** `POST /api/auth/register-with-otp`
   - Check email for OTP code
2. **Verify:** `POST /api/auth/verify-email` with code
   - Receive JWT token
3. **Login:** `POST /api/auth/login` with email + password
   - Can now login successfully

## Summary

- **Purpose:** Email verification during registration
- **Method:** 6-digit OTP sent via email
- **Storage:** Bcrypt hashed (secure)
- **Expiration:** 5 minutes
- **Security:** Rate-limited (3 attempts → 15min lockout)
- **Resend:** Available if expired
- **UX:** Clear UI with auto-focus inputs, countdown timer

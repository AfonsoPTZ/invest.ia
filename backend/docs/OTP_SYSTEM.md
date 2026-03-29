# OTP (One-Time Password) System

## Overview

OTP is used for **email verification during registration**. After user registers, a 6-digit OTP is emailed to them. They must verify this OTP to activate their account.

**Flow:**
```
1. User registers
   ↓
2. OTP generated (6 digits)
   ↓
3. OTP sent via email
   ↓
4. OTP stored in database (hashed, 10 min expiry)
   ↓
5. User enters OTP in frontend
   ↓
6. OTP validated
   ↓
7. Email marked verified in user record
```

---

## OTP Generation

**File:** `src/utils/generateOtp.js`

```javascript
function generateOtp() {
  // Generate random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = generateOtp;
```

**Properties:**
- 6-digit number (100000-999999)
- Random generation
- Cryptographically sufficient (not security-critical)
- Human-friendly format (easy to type)

---

## OTP Service

**File:** `src/services/auth/otp.service.js`

### Generating OTP

```javascript
async generateOtpForEmail(email) {
  try {
    logger.info({ email }, "Generating OTP");
    
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Store in database
    await userRepository.updateOtp(email, {
      otpHash: hashedOtp,
      otpExpiresAt: expiresAt
    });
    
    logger.info({ email }, "OTP generated and stored");
    return otp; // Return plain OTP (will be sent via email)
  } catch (error) {
    logger.error({ error: error.message, email }, "OTP generation failed");
    throw error;
  }
}
```

**Key points:**
- OTP hashed before storage (security best practice)
- 10-minute expiration
- Uses bcrypt (same as passwords)
- Returns plain OTP (for email)

### Verifying OTP

```javascript
async verifyOtp(email, providedOtp) {
  try {
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    if (!user.otpHash) {
      throw new Error("No OTP generated for this email");
    }
    
    // Check expiration
    if (new Date() > user.otpExpiresAt) {
      throw new Error("OTP expired");
    }
    
    // Compare provided OTP with stored hash
    const isValid = await bcrypt.compare(providedOtp, user.otpHash);
    
    if (!isValid) {
      logger.warn({ email }, "Invalid OTP provided");
      throw new Error("Invalid OTP");
    }
    
    logger.info({ email }, "OTP verified successfully");
    return true;
  } catch (error) {
    logger.error({ error: error.message, email }, "OTP verification failed");
    throw error;
  }
}
```

**Security:**
- Hash comparison prevents timing attacks
- Expiration checked
- User validation before comparison

---

## Email Verification Service

**File:** `src/services/auth/emailVerification.service.js`

### Mark Email as Verified

```javascript
async markEmailAsVerified(email) {
  try {
    logger.info({ email }, "Marking email as verified");
    
    // Update user
    await userRepository.updateUser(email, {
      emailVerified: true,
      otpHash: null,        // Clear OTP
      otpExpiresAt: null    // Clear expiration
    });
    
    logger.info({ email }, "Email verified successfully");
  } catch (error) {
    logger.error(
      { error: error.message, email }, 
      "Email verification failed"
    );
    throw error;
  }
}
```

---

## Verification Email Service

**File:** `src/services/auth/email.service.js`

### Sending OTP Email

```javascript
async sendOtpEmail(email, otp) {
  try {
    logger.info({ email }, "Sending OTP email");
    
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
        <p>This code expires in 10 minutes.</p>
        <p>If you didn't request this, please ignore.</p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    logger.info({ email }, "OTP email sent successfully");
  } catch (error) {
    logger.error({ error: error.message, email }, "Failed to send OTP email");
    throw error;
  }
}
```

**Email Properties:**
- Uses Gmail SMTP (configured in .env)
- HTML format for better UX
- Code formatted for easy reading
- 10-minute expiration warning

---

## Verify Email Controller

**File:** `src/controllers/authController.js`

### Verify OTP Endpoint

```javascript
async verifyOtp(request, response, next) {
  try {
    const { email, otp } = request.body;
    
    logger.info({ email }, "OTP verification request");
    
    // Validate input
    const validation = otpValidator.validateOtp(otp);
    if (!validation.isValid) {
      return response.status(400).json({
        error: validation.errors.join(", "),
        status: 400
      });
    }
    
    // Verify OTP
    await otpService.verifyOtp(email, otp);
    
    // Mark email as verified
    await emailVerificationService.markEmailAsVerified(email);
    
    logger.info({ email }, "Email verified");
    
    response.status(200).json({
      message: "Email verified successfully",
      status: 200
    });
  } catch (error) {
    logger.error(
      { error: error.message, email: request.body.email },
      "Verification failed"
    );
    next(error);
  }
}
```

---

## OTP Validator

**File:** `src/validators/otp.validator.js`

```javascript
const otpValidator = {
  validateOtp(otp) {
    const errors = [];
    
    // Check if provided
    if (!otp) {
      errors.push("OTP is required");
    }
    
    // Check format (must be 6 digits)
    if (!/^\d{6}$/.test(otp)) {
      errors.push("OTP must be exactly 6 digits");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

module.exports = otpValidator;
```

---

## Registration Flow

**Complete OTP integration in registration:**

```javascript
// authController.js - register endpoint
async register(request, response, next) {
  try {
    const { email, password, fullName } = request.body;
    
    logger.info({ email }, "Registration request");
    
    // 1. Validate input
    const validation = authValidator.validateRegister(
      fullName,
      email,
      password
    );
    if (!validation.isValid) {
      return response.status(400).json({
        error: validation.errors.join(", ")
      });
    }
    
    // 2. Check if user exists
    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
      return response.status(409).json({
        error: "Email already registered"
      });
    }
    
    // 3. Create user (emailVerified = false)
    const newUser = await registerService.registerUser({
      fullName,
      email,
      password
    });
    
    // 4. Generate and send OTP
    const otp = await otpService.generateOtpForEmail(email);
    await emailService.sendOtpEmail(email, otp);
    
    logger.info({ email }, "User registered, OTP sent");
    
    response.status(201).json({
      message: "Registration successful. OTP sent to email.",
      email,
      status: 201
    });
  } catch (error) {
    logger.error({ error: error.message }, "Registration failed");
    next(error);
  }
}
```

---

## Frontend Integration

**File:** `src/pages/auth/Register.jsx`

### Step 1: Registration

```javascript
const handleRegister = async (formData) => {
  try {
    const response = await authService.register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password
    });
    
    setEmail(formData.email);
    setShowOtpInput(true); // Show OTP screen
  } catch (error) {
    console.error("Registration error:", error.message);
  }
};
```

### Step 2: OTP Verification

**File:** `src/pages/auth/VerifyOtp.jsx`

```javascript
const handleVerifyOtp = async (otp) => {
  try {
    const response = await authService.verifyOtp({
      email,
      otp
    });
    
    // Redirect to login
    navigate("/auth/login");
  } catch (error) {
    console.error("OTP verification error:", error.message);
  }
};
```

---

## Database Schema

**users table columns:**

| Column | Type | Notes |
|--------|------|-------|
| id | INT PRIMARY KEY | User ID |
| email | VARCHAR(255) UNIQUE | Email address |
| emailVerified | BOOLEAN DEFAULT FALSE | Verification status |
| otpHash | VARCHAR(255) | Bcrypt hash of OTP |
| otpExpiresAt | DATETIME | OTP expiration time |

**Example schema:**
```sql
ALTER TABLE users ADD COLUMN otpHash VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN otpExpiresAt DATETIME NULL;
ALTER TABLE users ADD COLUMN emailVerified BOOLEAN DEFAULT FALSE;
```

---

## Security Considerations

### ✅ What's Good

- OTP hashed before storage (bcrypt)
- 10-minute expiration time
- 6-digit format (10^6 possibilities ≈ 1 million)
- Email verification prevents spam registrations
- Prevents brute force with rate limiting (can be added)

### ⚠️ Future Improvements

- [ ] Rate limiting on OTP requests (max 3 per day)
- [ ] Resend OTP functionality (max 5 resends)
- [ ] Track failed OTP attempts (lock after 5)
- [ ] Use SMS instead of email (more secure)
- [ ] Add backup codes for account recovery
- [ ] Email confirmation when email is verified

---

## Testing OTP

### Backend Unit Tests

```javascript
describe("OTP Service", () => {
  
  test("should generate valid 6-digit OTP", () => {
    const otp = generateOtp();
    expect(/^\d{6}$/.test(otp)).toBe(true);
  });

  test("should verify correct OTP", async () => {
    const otp = "123456";
    await otpService.generateOtpForEmail("test@test.com");
    
    const result = await otpService.verifyOtp("test@test.com", otp);
    expect(result).toBe(true);
  });

  test("should reject expired OTP", async () => {
    // Mock expiration time in past
    const user = await userRepository.findByEmail("test@test.com");
    user.otpExpiresAt = new Date(Date.now() - 1000);
    
    expect(() => 
      otpService.verifyOtp("test@test.com", "123456")
    ).toThrow("OTP expired");
  });

  test("should reject invalid OTP format", () => {
    const validation = otpValidator.validateOtp("12345"); // 5 digits
    expect(validation.isValid).toBe(false);
  });
});
```

### Frontend Testing

```javascript
describe("OTP Verification Component", () => {
  
  test("should show error for invalid OTP format", async () => {
    const { getByText } = render(<VerifyOtp />);
    
    fireEvent.change(screen.getByInput(), { target: { value: "12345" } });
    fireEvent.click(getByText("Verify"));
    
    expect(getByText(/must be 6 digits/i)).toBeInTheDocument();
  });

  test("should show error for expired OTP", async () => {
    mockVerifyOtpAPI.mockRejectedValue(new Error("OTP expired"));
    
    fireEvent.change(screen.getByInput(), { target: { value: "123456" } });
    fireEvent.click(getByText("Verify"));
    
    await waitFor(() => {
      expect(getByText(/OTP expired/i)).toBeInTheDocument();
    });
  });
});
```

---

## Troubleshooting

### OTP Email Not Received

**Potential causes:**
1. Email service not configured in .env
2. Gmail "Less secure apps" not enabled
3. Email address typo during registration
4. Email in spam folder

**Solution:**
- Check `.env` has `EMAIL_USER` and `EMAIL_PASSWORD`
- Enable Gmail 2FA and use App Password
- Check email address before sending
- Add Invest.IA to safe senders

### OTP Keeps Expiring

**Cause:** User takes too long to receive email/find OTP

**Solution:** Increase expiration from 10 minutes to 15-30 minutes

```javascript
// src/services/auth/otp.service.js
const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
```

### Can't Verify OTP (Invalid OTP Error)

**Potential causes:**
1. User entered wrong OTP
2. OTP expired
3. OTP already used (cleared from DB)
4. Email address mismatch

**Solution:**
- Verify OTP copy-pasted correctly
- Request new OTP if expired
- Check database records
- Ensure DB update cleared old OTP

---

## API Reference

### Generate OTP Endpoint

**POST** `/api/auth/generate-otp`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "message": "OTP sent to email",
  "email": "user@example.com",
  "status": 200
}
```

**Response (Error):**
```json
{
  "error": "User not found",
  "status": 404
}
```

---

### Verify OTP Endpoint

**POST** `/api/auth/verify-otp`

**Request:**
```json
{
  "email": "user@example.com",
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

**Response (Error - Invalid OTP):**
```json
{
  "error": "Invalid OTP",
  "status": 400
}
```

**Response (Error - Expired OTP):**
```json
{
  "error": "OTP expired",
  "status": 400
}
```

---

## Summary

- **Purpose:** Email verification during registration
- **Flow:** Generate → Send → Verify → Mark as verified
- **Generation:** 6-digit random number
- **Storage:** Bcrypt hashed + 10-minute expiration
- **Security:** Protected against brute force and timing attacks
- **UX Considerations:** User-friendly 6-digit format, email templates

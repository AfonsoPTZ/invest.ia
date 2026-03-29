# Frontend Validators

## Overview

Frontend validators provide quick, lightweight input validation for better user experience. They are **not** a replacement for backend validation - the backend is always the authoritative source of truth.

**Philosophy**: Validate early on the client for UX, validate thoroughly on the server for security.

## Validator Files

### 1. sharedValidator.js
Reusable validators used across different forms

#### `validateNotEmpty(value)`
Checks if value is not empty/null/undefined

```jsx
validateNotEmpty("hello") // true
validateNotEmpty("") // false
validateNotEmpty(null) // false
validateNotEmpty(undefined) // false
validateNotEmpty(0) // true (zero is valid)
```

#### `validateEmail(email)`
Basic email format validation

```jsx
validateEmail("user@example.com") // true
validateEmail("invalid.email") // false
validateEmail("") // false
```

**Note**: Checks format only, not existence. Backend validates uniqueness.

#### `validatePassword(password)`
Minimum 6 characters requirement

```jsx
validatePassword("pass") // false (4 chars)
validatePassword("password123") // true (11 chars)
validatePassword("") // false
```

#### `validatePasswordMatch(password1, password2)`
Compare two passwords for confirmation

```jsx
validatePasswordMatch("secret123", "secret123") // true
validatePasswordMatch("secret123", "secret124") // false
```

#### `validateNumber(value)`
Positive number validation

```jsx
validateNumber("1000") // true
validateNumber("0") // true
validateNumber("-100") // false
validateNumber("abc") // false
validateNumber("") // false
```

#### `validateCPF(cpf)`
CPF digit count validation (11 digits)

```jsx
validateCPF("12345678901") // true
validateCPF("123.456.789-01") // true (removes formatting)
validateCPF("123") // false (3 digits)
```

**Note**: Checks digit count only, not CPF algorithm. Backend validates using proper algorithm.

#### `validatePhone(phone)`
Phone digit count validation (11 digits for Brazil)

```jsx
validatePhone("11999999999") // true
validatePhone("(11) 99999-9999") // true (removes formatting)
validatePhone("119999999") // false (9 digits)
```

#### `validateOTP(otp)`
OTP code validation (6 digits)

```jsx
validateOTP("123456") // true
validateOTP("12345") // false (5 digits)
validateOTP("123456789") // false (9 digits)
```

### 2. authValidator.js
Validators for authentication forms

#### `validateLoginForm(email, password)`
Complete login form validation

```jsx
const error = validateLoginForm("user@example.com", "password123");
// Returns: null (valid) or error message string

// Validation sequence:
// 1. Email is required
// 2. Email format is valid
// 3. Password is required
// 4. Password is at least 6 characters
```

**Example Usage**:
```jsx
const handleLogin = async (e) => {
  e.preventDefault();
  
  const error = validateLoginForm(email, password);
  if (error) {
    setError(error); // "Please enter a valid email"
    return;
  }
  
  try {
    await login(email, password);
  } catch (err) {
    setError(err.message);
  }
};
```

#### `validateRegisterForm(name, email, cpf, phone, password, confirmPassword)`
Complete registration form validation

```jsx
const error = validateRegisterForm(
  "John Doe",
  "john@example.com",
  "12345678901",
  "11999999999",
  "password123",
  "password123"
);
// Returns: null (valid) or error message

// Validation sequence:
// 1. Name is required
// 2. Email is required
// 3. Email format is valid
// 4. CPF is required
// 5. CPF has 11 digits
// 6. Phone is required
// 7. Phone has 11 digits
// 8. Password is required
// 9. Password is at least 6 characters
// 10. Passwords match
```

#### `validateOTPCode(otp)`
OTP code validation

```jsx
const error = validateOTPCode("123456");
// Returns: "Please enter all 6 digits" or null

// Validation:
// 1. Code has exactly 6 digits
```

**Example Usage** (VerifyOtp.jsx):
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  
  const otpCode = otp.join(""); // "123456"
  const error = validateOTPCode(otpCode);
  if (error) {
    setError(error);
    return;
  }
  
  try {
    await verifyEmail(userId, otpCode);
  } catch (err) {
    setError(err.message);
  }
};
```

#### `validateFinancialProfileForm(formData)`
Financial profile form validation

```jsx
const error = validateFinancialProfileForm({
  financial_goal: "accumulate_wealth",
  has_monthly_income: true,
  monthly_income: "5000",
  has_initial_balance: true,
  initial_balance: "50000",
  has_investments: false,
  has_assets: false,
  behavior_profile: "moderado"
});
// Returns: null (valid) or error message

// Validation sequence:
// 1. Financial goal is selected
// 2. If has_monthly_income: monthly_income is valid positive number
// 3. If has_initial_balance: initial_balance is valid positive number
```

### 3. financialProfileValidator.js
Validators for financial operations (investments, expenses, assets, income)

#### `validateInvestmentForm(investment)`
Investment data validation

```jsx
const error = validateInvestmentForm({
  name: "Apple Stock",
  type: "stock",
  amount: "1000"
});
// Returns: null (valid) or error message

// Validation:
// 1. Name is required
// 2. Type is selected
// 3. Amount is valid positive number
// 4. Amount is greater than zero
```

#### `validateExpenseForm(expense)`
Expense data validation

```jsx
const error = validateExpenseForm({
  description: "Grocery shopping",
  category: "food",
  amount: "100.50"
});
// Returns: null (valid) or error message

// Validation:
// 1. Description is required
// 2. Category is selected
// 3. Amount is valid positive number
// 4. Amount is greater than zero
```

#### `validateAssetForm(asset)`
Asset data validation

```jsx
const error = validateAssetForm({
  name: "House",
  type: "real_estate",
  value: "250000"
});
// Returns: null (valid) or error message

// Validation:
// 1. Name is required
// 2. Type is selected
// 3. Value is valid positive number
// 4. Value is greater than zero
```

#### `validateIncomeForm(income)`
Income data validation

```jsx
const error = validateIncomeForm({
  source: "Salary",
  amount: "5000"
});
// Returns: null (valid) or error message

// Validation:
// 1. Source is required
// 2. Amount is valid positive number
// 3. Amount is greater than zero
```

## Usage Examples

### Login Page
```jsx
import { validateLoginForm } from "../../validators/authValidator";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation first
    const validationError = validateLoginForm(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      // Backend validation happens here
      const user = await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      // Backend error feedback
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Alert type="error">{error}</Alert>}
      <Button disabled={isLoading}>Sign In</Button>
    </form>
  );
}
```

### Registration Page
```jsx
import { validateRegisterForm } from "../../validators/authValidator";

function Register() {
  const [formData, setFormData] = useState({
    name: "", email: "", cpf: "", phone: "",
    password: "", confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    const validationError = validateRegisterForm(
      formData.name,
      formData.email,
      formData.cpf,
      formData.phone,
      formData.password,
      formData.confirmPassword
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // API call
      await register(formData);
      navigate("/verify-otp", { state: { userId, email: formData.email } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // Form JSX
  );
}
```

## Validation Scopes

### Frontend Only
These checks are ONLY for UX improvement:
- Empty fields
- Email format
- Password length
- Field matching (confirmation)
- CPF/phone digit count (format check)
- Positive numbers

### Frontend + Backend
These checks happen in both layers:
- Basic field presence
- Number ranges
- Format basics

### Backend Only (Authoritative)
These checks ONLY happen on server:
- Email uniqueness (database query)
- CPF uniqueness (database query)
- Password strength algorithm
- Business rule validation
- Account status checks
- Rate limiting
- Authentication verification

## When to Add New Validators

### ✅ DO Add to Frontend
- Input is straightforward (email, phone, date)
- Check has instant feedback (no database needed)
- Improves UX significantly
- Reduces unnecessary API calls

### ❌ DON'T Add to Frontend
- Requires database query (uniqueness checks)
- Complex business logic
- Security-sensitive validation
- Data consistency dependent

## Error Messages

All validators return `null` on success or an error message string on failure.

**Good Error Messages**:
- Clear and specific
- Indicate what went wrong
- Suggest how to fix
- Written for end users

**Examples**:
```
❌ Bad: "Validation failed"
✅ Good: "Please enter a valid email"

❌ Bad: "Invalid"
✅ Good: "CPF must have 11 digits"

❌ Bad: "Error"
✅ Good: "Password must be at least 6 characters"

❌ Bad: "Form error"
✅ Good: "Passwords do not match"
```

## Testing Validators

Recommended test cases for each validator:

### Successful Cases
- Empty string
- Valid input
- Whitespace handling

### Error Cases
- Various invalid formats
- Edge cases
- Null/undefined

### Example Test
```jsx
describe("validateEmail", () => {
  it("should accept valid emails", () => {
    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("test.email+tag@example.co.uk")).toBe(true);
  });

  it("should reject invalid emails", () => {
    expect(validateEmail("invalid.email")).toBe(false);
    expect(validateEmail("@example.com")).toBe(false);
    expect(validateEmail("user@")).toBe(false);
  });

  it("should handle empty strings", () => {
    expect(validateEmail("")).toBe(false);
  });
});
```

## Related Files

- Frontend validation: `frontend/src/validators/`
- Backend validation: `backend/src/validators/`
- Logger for tracking validation: `frontend/src/utils/logger.js`
- Pages using validators: `frontend/src/pages/auth/`

## Future Enhancements

1. ⬜ Add real-time validation feedback (as user types)
2. ⬜ Add custom error messages per field
3. ⬜ Add conditional validation rules
4. ⬜ Add regex pattern library
5. ⬜ Add translation support for error messages
6. ⬜ Add validator composition/chains
7. ⬜ Add async validators (for API checks)

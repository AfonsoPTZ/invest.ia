# Validators - Data Validation Layer

## Overview

Using professional libraries for validation instead of manual code:
- `express-validator` - Email validation (RFC standard)
- `cpf-cnpj-validator` - CPF algorithm verification
- `libphonenumber-js` - Brazilian phone + DDD validation

## File Structure

- **src/validators/userValidator.js** - User data validation (CPF, email, phone, name, password)
- **src/validators/perfilFinanceiroValidator.js** - Financial profile validation

## User Validators

### validateCPF(cpf)
- Verifies 11 digits + algorithm
- Removes formatting automatically
- Returns: `{ isValid, error, cleanedCPF }`

### validateEmail(email)
- RFC format check
- Normalized to lowercase
- Returns: `{ isValid, error, cleanedEmail }`

### validatePhone(phone)
- DDD validation (60+ Brazilian area codes)
- Accepts: (11) 98765-4321 or 11987654321 format
- Returns: `{ isValid, error, cleanedPhone }`

### validateName(name)
- Min 3, max 100 characters
- Letters and accented chars only
- Returns: `{ isValid, error, cleanedName }`

### validatePassword(password)
- Min 6, max 128 characters
- Optional strength scoring
- Returns: `{ isValid, strength }`

### validateUserRegistration(name, email, cpf, phone, password)
- Batch validation (collects all errors)
- Returns: `{ isValid, errors[], cleanedData }`

## Financial Validators

### validateMonthlyIncome(value)
- Must be valid number, not negative

### validateInitialBalance(value)
- Same as monthly income

### validateHasInvestments(bool)
- Accepts: true/false or string variations

### validateHasAssets(bool)
- Same as has investments

### validateFinancialGoal(goal)
- Valid: accumulate_wealth, retirement_planning, education_funding, home_purchase, emergency_fund, debt_reduction, short_term_savings, wealth_transfer, business_expansion, other

### validateBehaviorProfile(profile)
- Valid: conservative, moderate, aggressive

## Usage in Services

Services call validators FIRST, before database:

```javascript
const validation = userValidator.validateUserRegistration(...);
if (!validation.isValid) {
  throw new Error(validation.errors.join(", "));
}
// Use validation.cleanedData (safe + normalized)
```

## Return Format

All validators return consistent format:

```javascript
// Valid
{ isValid: true, cleanedData: {...} }

// Invalid
{ isValid: false, error: "message" }  // Single
{ isValid: false, errors: [...] }     // Batch
```

## Security

✅ Validation at service layer (before DB access)
✅ Data cleaned and normalized
✅ User-friendly error messages
✅ Prevents invalid data in database

## Summary

- Pure functions, no side effects
- Professional libraries (battle-tested)
- Consistent return format
- Batch validation for registration/profiles
- Security-first approach

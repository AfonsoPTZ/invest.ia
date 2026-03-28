# Backend Architecture - Doorkeeper Pattern

## Overview

The backend follows a **strict layered architecture** where each layer has a single responsibility. This ensures testability, maintainability, and scalability.

```
HTTP Request
    ↓
CONTROLLER (HTTP Handler)
    ↓
SERVICE (Orchestrator / Doorkeeper)
    ├─ Step 1: Call VALIDATOR
    ├─ Step 2: Check VALIDATOR result
    ├─ Step 3: Business Logic (async operations)
    └─ Step 4: Call REPOSITORY (if valid)
    ↓
VALIDATOR (Data Validation Rules)
    └─ Pure functions, no side effects
    
REPOSITORY (Database Access)
    └─ CRUD operations only
    
DATABASE
```

## Layer Responsibilities

### 1. Controller Layer
**File:** `src/controllers/*.js`

**Responsibilities:**
- ✅ Extract HTTP request data
- ✅ Call appropriate Service
- ✅ Return HTTP responses (status codes, JSON format)
- ❌ NO validation logic
- ❌ NO business logic
- ❌ NO database access

**Flow:**
```javascript
async function registerController(request, response) {
  const { name, email, cpf, phone, password } = request.body;
  
  // Delegate to service
  const result = await authService.registerUser(name, email, cpf, phone, password);
  
  // Return HTTP response
  return response.status(201).json({
    status: "success",
    message: "User registered successfully",
    user: result
  });
}
```

### 2. Service Layer (The Doorkeeper)
**File:** `src/services/*.js`

**Responsibilities:**
- ✅ Call validators FIRST
- ✅ Check validator results
- ✅ Business logic (async operations)
- ✅ Call repositories
- ✅ Orchestrate the entire flow
- ❌ NO HTTP handling
- ❌ Direct to database without validation

**Flow:**
```javascript
async function registerUser(name, email, cpf, phone, password) {
  // STEP 1: Validate all inputs
  const validation = userValidator.validateUserRegistration(
    name, email, cpf, phone, password
  );
  
  if (!validation.isValid) {
    throw new Error(validation.errors.join(", "));
  }
  
  const { name: cleanName, email: cleanEmail, cpf: cleanCPF, phone: cleanPhone } = validation.cleanedData;
  
  // STEP 2: Business logic - check duplicates
  if (await authRepository.emailExists(cleanEmail)) {
    throw new Error("Email already registered");
  }
  
  // STEP 3: Business logic - hash password
  const passwordHash = await bcrypt.hash(password, 10);
  
  // STEP 4: Call repository
  const newUser = await authRepository.create({
    name: cleanName,
    email: cleanEmail,
    cpf: cleanCPF,
    phone: cleanPhone,
    passwordHash
  });
  
  // STEP 5: Generate token
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET);
  
  return { id: newUser.id, name: newUser.name, email: newUser.email, token };
}
```

### 3. Validator Layer
**File:** `src/validators/*.js`

**Responsibilities:**
- ✅ Validate input data format and content
- ✅ Return cleaned/normalized data
- ✅ Return clear error messages
- ✅ Use professional libraries (express-validator, cpf-cnpj-validator, libphonenumber-js)
- ❌ NO database access
- ❌ NO side effects

**Pattern:**
```javascript
function validateCPF(cpf) {
  // ... validation logic
  if (isValid) {
    return { isValid: true, cleanedCPF: "12345678910" };
  } else {
    return { isValid: false, error: "CPF is invalid" };
  }
}
```

### 4. Repository Layer
**File:** `src/repositories/*.js`

**Responsibilities:**
- ✅ Execute database CRUD operations
- ✅ Build queries
- ✅ Manage connections
- ✅ Return raw database results
- ❌ NO validation
- ❌ NO business logic

**Pattern:**
```javascript
async function create(userData) {
  const query = `INSERT INTO users (name, email, cpf, phone, passwordHash) 
                 VALUES (?, ?, ?, ?, ?)`;
  const result = await db.execute(query, [
    userData.name,
    userData.email,
    userData.cpf,
    userData.phone,
    userData.passwordHash
  ]);
  return { id: result.insertId, ...userData };
}
```

## Responsibility Breakdown Table

| Layer | Validation | Business Logic | DB Access | HTTP Handling |
|-------|-----------|-----------------|-----------|---------------|
| **Controller** | ❌ NO | ❌ NO | ❌ NO | ✅ YES |
| **Service** | ✅ Orchestrate | ✅ YES | ❌ NO | ❌ NO |
| **Validator** | ✅ Pure Check | ❌ NO | ❌ NO | ❌ NO |
| **Repository** | ❌ NO | ❌ NO | ✅ YES | ❌ NO |

## Real Example: User Registration Flow

### Request Received
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "cpf": "123.456.789-10",
  "phone": "(11) 98765-4321",
  "password": "MyPass123!"
}
```

### Flow Execution

**1. CONTROLLER → registerController()**
- Extract fields from request.body
- Call: `authService.registerUser(...)`
- Wait for result

**2. SERVICE → authService.registerUser()**
- Step 1: Call validator
  ```javascript
  const validation = userValidator.validateUserRegistration(...)
  // Returns: { isValid: true, cleanedData: {...} }
  ```
- Step 2: Extract cleaned data
- Step 3: Check duplicates
  ```javascript
  emailExists("joao@email.com") → false ✓
  cpfExists("12345678910") → false ✓
  phoneExists("11987654321") → false ✓
  ```
- Step 4: Hash password
  ```javascript
  bcrypt.hash("MyPass123!", 10) → "$2a$10$..."
  ```
- Step 5: Generate token
  ```javascript
  jwt.sign({ id: 1, email: "joao@email.com" }, SECRET) → "eyJhbGc..."
  ```
- Step 6: Call repository
  ```javascript
  authRepository.create({ name, email, cpf, phone, passwordHash })
  // Returns: { id: 1, name: "João Silva", ... }
  ```

**3. VALIDATOR → userValidator.validateUserRegistration()**
- validateName() → { isValid: true, cleanedName: "João Silva" }
- validateEmail() → { isValid: true, cleanedEmail: "joao@email.com" }
- validateCPF() → { isValid: true, cleanedCPF: "12345678910" }
- validatePhone() → { isValid: true, cleanedPhone: "11987654321" }
- validatePassword() → { isValid: true, strength: 4 }
- Return all cleaned data

**4. REPOSITORY → authRepository.create()**
```sql
INSERT INTO users (name, email, cpf, phone, passwordHash)
VALUES ('João Silva', 'joao@email.com', '12345678910', '11987654321', '$2a$10$...')
```

**5. CONTROLLER → Return HTTP Response**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com"
  },
  "token": "eyJhbGc..."
}
```

## Error Handling Example

### Invalid Data Entry
```json
{
  "name": "X",
  "email": "invalid",
  "cpf": "111.111.111-11",
  "phone": "1234567890",
  "password": "abc"
}
```

### Flow

**1. SERVICE calls VALIDATOR**
```javascript
const validation = userValidator.validateUserRegistration(...)
// Returns: {
//   isValid: false,
//   errors: [
//     "Name must have at least 3 characters",
//     "Email format is invalid",
//     "CPF is invalid",
//     "Phone number is invalid",
//     "Password must have at least 6 characters"
//   ]
// }
```

**2. SERVICE checks result**
```javascript
if (!validation.isValid) {
  throw new Error(validation.errors.join(", "));
}
```

**3. SERVICE throws error → propagates to CONTROLLER**

**4. CONTROLLER catches error → returns HTTP response**
```json
{
  "status": "error",
  "message": "Name must have at least 3 characters, Email format is invalid, ...",
  "statusCode": 400
}
```

## Benefits of This Architecture

✅ **Separation of Concerns** - Each layer does one thing well
✅ **Testability** - Validators can be tested without DB; Services without HTTP
✅ **Maintainability** - Change validation? Update validator only
✅ **Reusability** - Same validators can be used in multiple services
✅ **Security** - Validation happens at service layer (always enforced)
✅ **Scalability** - Easy to add new services following same pattern
✅ **Error Handling** - Consistent error flow through all layers

## Files Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js (HTTP handlers)
│   │   └── perfilFinanceiroController.js
│   ├── services/
│   │   ├── authService.js (Orchestration)
│   │   └── perfilFinanceiroService.js
│   ├── validators/
│   │   ├── userValidator.js (Data validation)
│   │   └── perfilFinanceiroValidator.js
│   ├── repositories/
│   │   ├── authRepository.js (DB access)
│   │   └── perfilFinanceiroRepository.js
│   ├── middlewares/ (Authentication, error handling)
│   ├── routes/ (Route definitions)
│   ├── config/ (Configuration)
│   ├── utils/ (Helper functions)
│   ├── app.js (Express app setup)
│   └── server.js (Server startup)
└── docs/
    ├── ARCHITECTURE.md (This file)
    └── VALIDATORS.md (Validation layer documentation)
```

## When to Modify Each Layer

### Add New Validation Rule?
→ Modify `src/validators/userValidator.js`
→ Add new validation function
→ Use in `validateUserRegistration()`

### Add Business Logic?
→ Modify `src/services/authService.js`
→ Add new step in orchestration flow
→ Service calls validator, then repository

### Change Database Query?
→ Modify `src/repositories/authRepository.js`
→ Update SQL query or mapping logic
→ Service layer calls unchanged

### Add New API Endpoint?
→ Create new endpoint in routes
→ Create handler in controller
→ Create orchestrator in service
→ Use existing validators or create new ones

## Testing Strategy

```
Unit Tests:
├─ Validators: Test with valid/invalid data
├─ Services: Mock validators and repositories
└─ Repositories: Mock database connections

Integration Tests:
├─ Service → Validator → Repository chain
└─ Database interactions

End-to-End Tests:
├─ Full HTTP request → response
├─ Valid and invalid data scenarios
└─ Error handling and edge cases
```

## Summary

The **Doorkeeper Pattern** ensures:
1. **Controllers** are thin and focused on HTTP
2. **Services** orchestrate and enforce business rules
3. **Validators** are pure and testable
4. **Repositories** handle only data access

This makes the backend clean, maintainable, and production-ready.

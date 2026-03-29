# DTOs and Entities - Data Transfer Layer

## Overview

**DTOs (Data Transfer Objects)** and **Entities** are bridge layers between Controllers/Repositories and the business logic layer.

- **DTOs**: Transfer data from API request/response
- **Entities**: Map database records to domain objects in JavaScript

## DTOs - Data Transfer Objects

### Purpose
- Validate and clean incoming request data
- Provide structured response format
- Prevent exposing sensitive fields (passwords, hashes)

### Location
`src/dtos/`

### Available DTOs

#### 1. `register.dto.js` - User Registration
```javascript
// Factory method: create from HTTP request
const dto = RegisterDTO.fromRequest(request.body);

// Input fields
{
  name: string,
  email: string,
  cpf: string,
  phone: string,
  password: string
}

// Method: toJSON() - safe serialization (excludes password)
{
  name: string,
  email: string,
  cpf: string,
  phone: string
}
```

#### 2. `login.dto.js` - User Login
```javascript
const dto = LoginDTO.fromRequest(request.body);

// Input
{
  email: string,
  password: string
}

// toJSON() - excludes password
{
  email: string
}
```

#### 3. `verify-otp.dto.js` - OTP Verification
```javascript
const dto = VerifyOtpDTO.fromRequest(request.body);

// Input
{
  userId: number,
  otpCode: string
}

// toJSON() - safe response
{
  userId: number
}
```

#### 4. `financial-profile.dto.js` - Financial Profile
```javascript
const dto = FinancialProfileDTO.fromRequest(request.body);

// Input
{
  monthly_income: number,
  initial_balance: number,
  has_investments: boolean,
  has_assets: boolean,
  financial_goal: string,
  behavior_profile: enum ('conservative', 'moderate', 'aggressive')
}

// toJSON() - same as input (no sensitive data)
```

#### 5. `auth-response.dto.js` - Authentication Response
```javascript
// Created from login/register success
{
  id: number,
  name: string,
  email: string,
  token: string (JWT)
}
```

### DTO Pattern Usage

**In Controllers:**
```javascript
// Extract DTO from request
const registerDTO = RegisterDTO.fromRequest(request.body);

// Pass to service
const user = await authService.registerUser(
  registerDTO.email,
  registerDTO.password,
  registerDTO.name,
  registerDTO.cpf,
  registerDTO.phone
);

// Create response DTO
const responseDTO = AuthResponseDTO.fromService(user, token);
response.json({ data: responseDTO });
```

---

## Entities - Domain Objects

### Purpose
- Map database snake_case columns to JavaScript camelCase
- Provide domain logic helpers
- Encapsulate business rules
- Type safety for object properties

### Location
`src/entities/`

### Available Entities

#### 1. `user.entity.js` - User Domain Object
```javascript
// Factory: create from database row
const user = UserEntity.fromDatabase(dbRow);

// Properties (maps: nome→name, telefone→phone, etc)
{
  id: number,
  name: string,
  email: string,
  cpf: string,
  phone: string,
  passwordHash: string,
  emailVerified: boolean,
  createdAt: datetime,
  updatedAt: datetime
}

// Methods
user.isEmailVerified()  // returns: boolean
user.toJSON()           // returns: public-safe object (excludes passwordHash)
```

#### 2. `financial-profile.entity.js` - Finance Domain Object
```javascript
// Factory: create from database
const profile = FinancialProfileEntity.fromDatabase(dbRow);

// Properties (snake_case→camelCase)
{
  id: number,
  userId: number,
  monthly_income: number,
  initial_balance: number,
  has_investments: boolean,
  has_assets: boolean,
  financial_goal: string,
  behavior_profile: enum,
  created_at: datetime,
  updated_at: datetime
}

// Methods
profile.hasInvestments()     // returns: boolean
profile.hasAssets()          // returns: boolean
profile.toJSON()             // serializable object
```

#### 3. `token.entity.js` - JWT Token Domain Object
```javascript
// Factory: create from JWT payload
const token = TokenEntity.fromPayload(payload);

// Properties
{
  userId: number,
  email: string,
  iat: timestamp (issued at),
  exp: timestamp (expiration)
}

// Methods
token.isExpired()   // returns: boolean
token.toJSON()      // returns: payload object
```

---

## Entity vs DTO: When to Use

| Scenario | Use | Reason |
|----------|-----|--------|
| Extracting HTTP request data | **DTO** | Validate input, clean data |
| Repository returns DB row | **Entity** | Map columns, business logic |
| Sending response to client | **DTO** | Control which fields expose |
| Internal service logic | **Entity** | Type safety, domain helpers |
| Passing between layers | Either | DTOs for API, Entities for domain |

---

## Mapping Flow

```
HTTP Request
    ↓
[DTO.fromRequest()] → validates & cleans
    ↓
Controller → Service → Repository
    ↓
Database Row
    ↓
[Entity.fromDatabase()] → maps columns, adds methods
    ↓
Service uses Entity.methods() → business logic
    ↓
Response [DTO.fromService()] → public-safe object
    ↓
HTTP Response (JSON)
```

---

## Best Practices

1. **DTO.toJSON()** should never expose:
   - passwordHash
   - otpCodeHash
   - Sensitive user info

2. **Entity.fromDatabase()** always receives raw DB row:
   - Maps snake_case to camelCase
   - Never mutates original row

3. **Entity methods** contain domain logic:
   - `isEmailVerified()`
   - `hasInvestments()`
   - Calculations or derived values

4. **DTOs are factories**:
   - Always use `.fromRequest()` or `.fromService()`
   - Never instantiate with `new`

5. **Entities are mappers**:
   - Always use `.fromDatabase()`
   - Provides consistent property names across app

---

## Adding New DTOs/Entities

### New DTO Template
```javascript
/**
 * MyFeatureDTO - Transfer object for my feature
 */
class MyFeatureDTO {
  constructor(field1, field2) {
    this.field1 = field1;
    this.field2 = field2;
  }

  static fromRequest(body) {
    return new MyFeatureDTO(
      body.field1,
      body.field2
    );
  }

  toJSON() {
    return {
      field1: this.field1,
      field2: this.field2
      // Exclude sensitive data
    };
  }
}

module.exports = MyFeatureDTO;
```

### New Entity Template
```javascript
/**
 * MyDomainEntity - Domain object for my feature
 */
class MyDomainEntity {
  constructor(id, field1, field2) {
    this.id = id;
    this.field1 = field1;
    this.field2 = field2;
  }

  static fromDatabase(dbRow) {
    return new MyDomainEntity(
      dbRow.id,
      dbRow.database_field_1,  // maps snake_case
      dbRow.database_field_2
    );
  }

  // Domain logic methods
  isValid() {
    return this.field1 && this.field2;
  }

  toJSON() {
    return {
      id: this.id,
      field1: this.field1,
      field2: this.field2
    };
  }
}

module.exports = MyDomainEntity;
```

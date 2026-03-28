# Backend Documentation

## Quick Navigation

### 📚 **[ARCHITECTURE.md](./ARCHITECTURE.md)**
Complete guide to the backend architecture using the **Doorkeeper Pattern**.

**Topics covered:**
- Layer responsibilities (Controller → Service → Validator → Repository)
- Real example: User registration flow
- Error handling pattern
- File structure
- Benefits of the architecture
- Testing strategy

👉 **Read this first** to understand how the backend works.

---

### 🔍 **[VALIDATORS.md](./VALIDATORS.md)**
Complete guide to data validation layer.

**Topics covered:**
- Professional libraries used (express-validator, cpf-cnpj-validator, libphonenumber-js)
- Validator functions (CPF, Email, Phone, Name, Password)
- Real examples with test cases
- Usage in services
- Testing validators
- Adding new validators

👉 **Read this** to understand how input validation works.

---

## File Structure

```
backend/
├── docs/
│   ├── README.md (You are here)
│   ├── ARCHITECTURE.md (Backend architecture)
│   └── VALIDATORS.md (Validation layer)
├── src/
│   ├── controllers/ (HTTP handlers)
│   ├── services/ (Business logic orchestrators)
│   ├── validators/ (Data validation)
│   ├── repositories/ (Database access)
│   ├── middlewares/
│   ├── routes/
│   ├── config/
│   ├── utils/
│   ├── app.js
│   └── server.js
└── package.json
```

---

## Quick Start

### 1. Understand the Architecture
Start with [ARCHITECTURE.md](./ARCHITECTURE.md) to learn the layered pattern.

### 2. Understand Validation
Read [VALIDATORS.md](./VALIDATORS.md) to see how data is validated.

### 3. Start Coding
Follow these patterns when adding new features:

```
1. Create validator function (if needed) in src/validators/
2. Create service function in src/services/
3. Create controller function in src/controllers/
4. Map route in src/routes/
```

---

## Key Concepts

### Doorkeeper Pattern
```
HTTP Request
    ↓
CONTROLLER (thin, HTTP only)
    ↓
SERVICE (orchestrator - calls validators, then repository)
    ↓
VALIDATOR (pure functions - validate data only)
    ↓
REPOSITORY (database access only)
    ↓
DATABASE
```

### Validator Pattern
```javascript
function validate(data) {
  if (/* invalid */) {
    return { isValid: false, error: "message" };
  }
  return { isValid: true, cleanedData: data };
}
```

### Service Pattern
```javascript
async function doSomething(data) {
  // Step 1: Validate
  const validation = validator.validate(data);
  if (!validation.isValid) throw Error(validation.error);
  
  // Step 2: Business logic
  // ...
  
  // Step 3: Call repository
  const result = await repository.create(validation.cleanedData);
  
  return result;
}
```

---

## Common Tasks

### Add a New Validator
1. Create function in `src/validators/domain.js`
2. Return `{ isValid, error, cleanedData }`
3. Use in service layer
4. Document in VALIDATORS.md

### Add a New Service Function
1. Import validator
2. Call validator first
3. Check result
4. Business logic
5. Call repository
6. Return result

### Add a New API Endpoint
1. Create validator (if needed)
2. Create service orchestrator
3. Create controller handler
4. Add route in routes/
5. Update docs

---

## Dependencies

**Core:**
- Express.js - Web framework
- bcryptjs - Password hashing
- jsonwebtoken - Authentication tokens

**Database:**
- mysql2 - MySQL driver

**Validation:**
- express-validator - Email validation
- cpf-cnpj-validator - CPF algorithm verification
- libphonenumber-js - Brazilian phone validation

---

## Running Tests

```bash
# Unit tests (validators)
npm test validators

# Integration tests (services)
npm test services

# End-to-end tests
npm test e2e

# All tests
npm test
```

---

## Environment Variables

See `.env` file:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=invest_ia
JWT_SECRET=your-secret-key
PORT=3000
```

---

## Deployment Checklist

- [ ] All validators working
- [ ] All services tested
- [ ] Database migrations run
- [ ] Environment variables set
- [ ] JWT secret configured
- [ ] Error handling in place
- [ ] Logs configured
- [ ] Security headers added

---

## Need Help?

1. **Understanding the flow?** → Read ARCHITECTURE.md
2. **Validating data?** → Read VALIDATORS.md
3. **Adding a feature?** → Follow the patterns in existing code
4. **Something not working?** → Check error messages and logs

---

## Last Updated
March 28, 2026

## Maintainers
Backend Team

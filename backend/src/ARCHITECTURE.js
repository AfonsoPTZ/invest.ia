// BACKEND ARCHITECTURE - Doorkeeper Pattern
// ============================================

/*
FLUXO DE REQUISIÇÃO:

    CLIENT REQUEST
        ↓
    CONTROLLER (HTTP Handler)
        ↓ [Delegates ALL validation to Service]
    SERVICE (Doorkeeper / Orchestrator)
        ├─ Step 1: Call VALIDATOR
        ├─ Step 2: Check VALIDATOR result
        ├─ Step 3: Call REPOSITORY (if validation OK)
        └─ Step 4: Return result to Controller
        ↓
    VALIDATOR (Data Validation Rules)
        └─ Real market validations:
            ├─ CPF: Validates 11 digits + algorithm
            ├─ Email: Format validation (RFC standard)
            ├─ Phone: DDD (area codes) + digit count
            ├─ Numbers: Range, decimals, negatives
            ├─ Strings: Length, characters allowed
            └─ Enums: Allowed values only

    REPOSITORY (Database Access)
        └─ Direct queries:
            ├─ Create, Read, Update, Delete
            ├─ Duplicate checks (email, CPF, phone)
            └─ No business logic here
        ↓
    DATABASE


ARCHITECTURAL PATTERN:

┌─────────────────────────────────────────────────────────────────┐
│                    REQUEST HANDLER                              │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Function: registerController(request, response)            │ │
│ │ ├─ Extract data from request.body                         │ │
│ │ ├─ Delegate to authService.registerUser()                 │ │
│ │ └─ Return HTTP response (status codes, messages)          │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────┬──────────────────────────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│            BUSINESS LOGIC → ORCHESTRATOR                         │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Function: authService.registerUser(name, email, ...)      │ │
│ │ Step 1: Call validators                                   │ │
│ │         → validateUserRegistration()                      │ │
│ │         → Returns { isValid, cleanedData, errors }        │ │
│ │                                                            │ │
│ │ Step 2: Check validator result                            │ │
│ │         ├─ If NOT valid → throw Error                     │ │
│ │         └─ If valid → continue                            │ │
│ │                                                            │ │
│ │ Step 3: Business logic (async operations)                 │ │
│ │         ├─ Check duplicates: emailExists(), cpfExists()   │ │
│ │         ├─ Hash password: bcrypt.hash()                   │ │
│ │         └─ Generate token: jwt.sign()                     │ │
│ │                                                            │ │
│ │ Step 4: Call repository                                   │ │
│ │         → authRepository.create()                         │ │
│ │         → Returns newUser object                          │ │
│ │                                                            │ │
│ │ Step 5: Return to controller                              │ │
│ │         → { id, name, email, token }                      │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────┬──────────────────────────────────────────────────────┘
         │
         ├─→ Calls Validator
         │   ↓
         │   ┌──────────────────────────────────────┐
         │   │   PURE DATA VALIDATORS               │
         │   │ (No side effects, no DB access)      │
         │   │                                      │
         │   │ ├─ validateCPF(cpf)                 │
         │   │ │  ├─ Check 11 digits               │
         │   │ │  ├─ Check not all same            │
         │   │ │  └─ Verify algorithm              │
         │   │ │     → { isValid, cleanedCPF }     │
         │   │ │                                   │
         │   │ ├─ validateEmail(email)             │
         │   │ │  ├─ Check format (regex)          │
         │   │ │  ├─ Check max length              │
         │   │ │  └─ Normalize (lowercase)         │
         │   │ │     → { isValid, cleanedEmail }   │
         │   │ │                                   │
         │   │ ├─ validatePhone(phone)             │
         │   │ │  ├─ Check DDD validity           │
         │   │ │  ├─ Check digit count (10-11)    │
         │   │ │  └─ Verify first digit            │
         │   │ │     → { isValid, cleanedPhone }   │
         │   │ │                                   │
         │   │ └─ validateUserRegistration(...)    │
         │   │    └─ Batch validate all fields     │
         │   │       → { isValid, cleanedData,     │
         │   │          errors[] }                 │
         │   └──────────────────────────────────────┘
         │
         └─→ Calls Repository
             ↓
             ┌──────────────────────────────────────┐
             │   DATABASE ACCESSOR                  │
             │ (CRUD operations only)               │
             │                                      │
             │ ├─ async create(userData) {          │
             │ │  ├─ INSERT INTO users              │
             │ │  └─ return newUser                 │
             │ │                                   │
             │ ├─ async findByEmail(email) {        │
             │ │  ├─ SELECT * FROM users            │
             │ │  └─ return user or null            │
             │ │                                   │
             │ ├─ async emailExists(email) {        │
             │ │  ├─ COUNT(*) WHERE email          │
             │ │  └─ return boolean                 │
             │ │                                   │
             │ └─ async cpfExists(cpf) {            │
             │    ├─ COUNT(*) WHERE cpf            │
             │    └─ return boolean                 │
             └──────────────────────────────────────┘


RESPONSIBILITY BREAKDOWN:

┌──────────────┬──────────────────────────────┬──────────────────┐
│ LAYER        │ RESPONSIBILITIES             │ EXAMPLES         │
├──────────────┼──────────────────────────────┼──────────────────┤
│ CONTROLLER   │ ✓ Extract HTTP data          │ POST /register   │
│              │ ✓ Call Service               │ GET /me          │
│              │ ✓ Format HTTP response       │ Status codes     │
│              │ ✗ NO validation              │ ✗ No if !email   │
│              │ ✗ NO business logic          │ ✗ No bcrypt()    │
├──────────────┼──────────────────────────────┼──────────────────┤
│ SERVICE      │ ✓ Call Validators first      │ validateCPF()    │
│              │ ✓ Orchestrate flow           │ Check existing   │
│              │ ✓ Business logic             │ Hash / Generate  │
│              │ ✓ Call Repository            │ Create user      │
│              │ ✗ NO direct HTTP handling    │ ✗ response.json()│
├──────────────┼──────────────────────────────┼──────────────────┤
│ VALIDATOR    │ ✓ Data validation rules      │ CPF algorithm    │
│              │ ✓ Return clean data          │ Email format     │
│              │ ✓ Return error messages      │ Phone DDD check  │
│              │ ✗ NO database access         │ ✗ No SELECT      │
│              │ ✗ NO side effects            │ ✗ No bcrypt()    │
├──────────────┼──────────────────────────────┼──────────────────┤
│ REPOSITORY   │ ✓ Database CRUD only         │ INSERT, SELECT   │
│              │ ✓ Query building             │ WHERE clauses    │
│              │ ✓ Connection management      │ async/await      │
│              │ ✗ NO business logic          │ ✗ No bcrypt()    │
│              │ ✗ NO validation              │ ✗ No CPF check   │
└──────────────┴──────────────────────────────┴──────────────────┘


REAL EXAMPLES:

Example 1: User Registration
──────────────────────────────

CLIENT SENDS:
{
  "name": "João Silva",
  "email": "joao@email.com",
  "cpf": "123.456.789-10",
  "phone": "(11) 98765-4321",
  "password": "MyPass123!"
}

CONTROLLER (registerController):
  1. Extract: { name, email, cpf, phone, password } = req.body
  2. Call: authService.registerUser(name, email, cpf, phone, password)
  3. Wait for result (Promise)
  4. Return: { status: "success", user: {...}, token: "..." }

SERVICE (authService.registerUser):
  1. Call: userValidator.validateUserRegistration(...)
     Returns: {
       isValid: true,
       cleanedData: {
         name: "João Silva",
         email: "joao@email.com",
         cpf: "12345678910",
         phone: "11987654321",
         password: "MyPass123!"
       }
     }
  
  2. Check: if (!validation.isValid) throw Error
  
  3. Check duplicates:
     - emailExists("joao@email.com") → false ✓
     - cpfExists("12345678910") → false ✓
     - phoneExists("11987654321") → false ✓
  
  4. Hash password: bcrypt.hash("MyPass123!", 10)
     Result: "$2a$10$..."
  
  5. Generate token: jwt.sign({ id, email, name }, secret)
     Result: "eyJhbGc..."
  
  6. Call: authRepository.create({
       name: "João Silva",
       email: "joao@email.com",
       cpf: "12345678910",
       phone: "11987654321",
       passwordHash: "$2a$10$..."
     })
     Returns: { id: 1, name: "João Silva", ... }
  
  7. Return to Controller: { id: 1, name: "João Silva", ..., token: "eyJhbGc..." }

VALIDATOR (userValidator.validateUserRegistration):
  1. Batch validate all fields:
  
     validateName("João Silva"):
       - NOT empty
       - length >= 3 ✓
       - length <= 100 ✓
       - NO special chars except - and ' ✓
       → { isValid: true, cleanedName: "João Silva" }
  
     validateEmail("joao@email.com"):
       - Match regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ✓
       - length <= 254 ✓
       → { isValid: true, cleanedEmail: "joao@email.com" }
  
     validateCPF("123.456.789-10"):
       - Extract digits: "12345678910"
       - Count: 11 digits ✓
       - NOT "11111111111" ✓
       - Verify algorithm:
         * First digit: (1*10 + 2*9 + 3*8 + ...) % 11
         * Second digit: same for first 10 digits
       - Match: "12345678910"[9:11] ✓
       → { isValid: true, cleanedCPF: "12345678910" }
  
     validatePhone("(11) 98765-4321"):
       - Extract digits: "11987654321"
       - Count: 11 digits ✓
       - DDD "11": Valid Brazilian area code ✓
       - First digit after DDD "9": Valid (mobile) ✓
       → { isValid: true, cleanedPhone: "11987654321" }
  
     validatePassword("MyPass123!"):
       - length >= 6 ✓
       - length <= 128 ✓
       - Has uppercase, lowercase, numbers, special ✓
       → { isValid: true, strength: 4 }
  
  2. All valid → return:
     {
       isValid: true,
       cleanedData: {
         name: "João Silva",
         email: "joao@email.com",
         cpf: "12345678910",
         phone: "11987654321",
         password: "MyPass123!"
       }
     }

REPOSITORY (authRepository.create):
  1. Database INSERT:
     INSERT INTO users (name, email, cpf, phone, passwordHash)
     VALUES ('João Silva', 'joao@email.com', ...)
  
  2. Get inserted data back
  
  3. Return: { id: 1, name: "João Silva", ... }


Example 2: Invalid CPF
──────────────────────

CONTROLLER receives:
{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "cpf": "111.111.111-11",  ← ALL SAME DIGITS
  "phone": "(11) 98765-4321",
  "password": "Pass123"
}

FLOW:
  Controller → Service → Validator

VALIDATOR (validateCPF):
  1. Extract: "11111111111"
  2. Check all same: /^(\d)\1{10}$/ → MATCH!
  3. Return: {
       isValid: false,
       error: "CPF with all same digits is invalid"
     }

SERVICE:
  1. Get validator result
  2. Check: if (!validation.isValid) throw Error(errors.join(...))
  3. Throw: Error("CPF with all same digits is invalid")

CONTROLLER:
  1. Catch error
  2. Return: {
       status: "error",
       message: "CPF with all same digits is invalid",
       status code: 400
     }

CLIENT gets: 400 Bad Request with error message


FILES CREATED/REFACTORED:
────────────────────────

✓ src/validators/userValidator.js
  ├─ validateCPF() - Real algorithm check
  ├─ validateEmail() - Format + RFC compliance
  ├─ validatePhone() - DDD validation
  ├─ validateName() - Length + chars
  ├─ validatePassword() - Strength check
  └─ validateUserRegistration() - Batch all fields

✓ src/validators/perfilFinanceiroValidator.js
  ├─ validateMonthlyIncome() - Number range check
  ├─ validateInitialBalance() - Number range check
  ├─ validateHasInvestments() - Boolean validation
  ├─ validateHasAssets() - Boolean validation
  ├─ validateFinancialGoal() - Enum check
  ├─ validateBehaviorProfile() - Enum check (conservative/moderate/aggressive)
  └─ validateFinancialProfileRegistration() - Batch all fields

✓ src/services/authService.js
  ├─ REFACTORED: registerUser() - Now uses validators
  ├─ REFACTORED: login() - Now uses validators
  ├─ REFACTORED: changePassword() - Now uses validators
  └─ Unchanged: getUserData() - Simple fetch

✓ src/services/perfilFinanceiroService.js
  ├─ REFACTORED: createProfile() - Now uses validators
  ├─ REFACTORED: getProfile() - Added validation
  └─ Changed method names: createPerfil → createProfile

✓ src/controllers/authController.js
  ├─ SIMPLIFIED: registerController - No validation
  ├─ SIMPLIFIED: loginController - No validation
  └─ Unchanged: logoutController, getMeController

✓ src/controllers/perfilFinanceiroController.js
  ├─ SIMPLIFIED: create() - No validation
  ├─ SIMPLIFIED: get() - No validation
  └─ Changed method names: req → request, res → response


BENEFITS OF THIS PATTERN:
────────────────────────

1. SEPARATION OF CONCERNS
   - Validators = pure data validation (testable, reusable)
   - Services = business logic (orchestration, dependencies)
   - Controllers = HTTP handling (request/response)
   - Repositories = data access (CRUD)

2. TESTABILITY
   - Validators can be tested without mocking DB
   - Services can be tested with mocked validators
   - Controllers can be tested with mocked services

3. MAINTAINABILITY
   - Add new validation? Update validator only
   - Change business logic? Update service logic steps
   - Add new field? Update validator + repository

4. REUSABILITY
   - Same validators used in multiple services
   - Can validate frontend + backend consistently

5. ERROR HANDLING
   - Clear error messages from validators
   - Consistent error flow through layers

6. CONSISTENT RESPONSE FORMAT
   - All controllers return same format
   - Easy to standardize HTTP responses

*/

module.exports = {
  description: "Backend Architecture Documentation - Doorkeeper Pattern",
  lastUpdated: "2026-03-28",
  contributors: ["Backend Team"]
};

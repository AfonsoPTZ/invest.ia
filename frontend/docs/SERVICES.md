# Frontend Services

## Overview

Services are HTTP clients that handle all communication with the backend API. They are responsible for:
- Making HTTP requests
- Managing authentication tokens
- Error handling and transformation
- Logging API interactions
- Request/response serialization

Services contain **no business logic**, **no UI state management**, and **no routing decisions**.

## Architecture

All services follow a consistent pattern:

```jsx
// 1. Setup
import logger from "../utils/logger";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// 2. Service function
export async function operation(params) {
  try {
    // Get token
    const token = localStorage.getItem("token");
    
    // Make request
    const response = await fetch(`${API_URL}/endpoint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(params)
    });

    // Parse response
    const data = await response.json();

    // Check for errors
    if (!response.ok) {
      logger.warn({}, `Operation failed: ${data.message}`);
      throw new Error(data.message || "Error");
    }

    // Log success
    logger.info({}, "Operation succeeded");
    return data.data || data;
  } catch (error) {
    logger.error({ error: error.message }, "Operation error");
    throw error;
  }
}
```

## Services Reference

### 1. authService.js
Authentication operations

#### `login(email, password)`
User login with credentials

```jsx
import { login } from "../../services/authService";

try {
  const user = await login("user@example.com", "password123");
  // Returns: { id, name, email }
  // Side effect: Stores JWT in localStorage
} catch (err) {
  console.error(err.message); // "Invalid credentials"
}
```

**API Endpoint**: POST `/api/auth/login`
**Headers**: Content-Type: application/json
**Body**: `{ email, password }`
**Response**: `{ token: "jwt...", user: { id, name, email } }`
**Errors**: 
- Invalid credentials
- User not found
- Account locked

#### `register(name, email, cpf, phone, password)`
User registration (triggers OTP email)

```jsx
import { register } from "../../services/authService";

try {
  const result = await register(
    "John Doe",
    "john@example.com",
    "12345678901",
    "11999999999",
    "password123"
  );
  // Returns: { userId: 123, email, message }
  // Side effect: Backend sends OTP email
} catch (err) {
  console.error(err.message); // "Email already registered"
}
```

**API Endpoint**: POST `/api/auth/register-with-otp`
**Body**: `{ name, email, cpf, phone, password }`
**Response**: `{ userId, email, message }`
**Errors**:
- Email already registered
- Invalid CPF
- Password too weak

#### `logout()`
User logout

```jsx
import { logout } from "../../services/authService";

await logout();
// Side effects:
// - Notifies backend
// - Removes token from localStorage
// - Safe to call even if no token
```

**API Endpoint**: POST `/api/auth/logout`
**Headers**: Authorization: Bearer {token}
**Response**: `{ message: "Logged out successfully" }`

#### `getMe()`
Get authenticated user info

```jsx
import { getMe } from "../../services/authService";

try {
  const user = await getMe();
  // Returns: { id, name, email, createdAt, ... }
} catch (err) {
  console.error(err.message); // "Token not found" or "Unauthorized"
}
```

**API Endpoint**: GET `/api/auth/me`
**Headers**: Authorization: Bearer {token}
**Response**: `{ user: { id, name, email, ... } }`
**Errors**:
- No token found
- Token invalid/expired
- User not found

#### `checkAuth()`
Check if user is authenticated (lightweight)

```jsx
import { checkAuth } from "../../services/authService";

const isAuth = await checkAuth();
// Returns: true or false
// Safe to call always (no error thrown)
```

**API Endpoint**: GET `/api/auth/check`
**Headers**: Authorization: Bearer {token}
**Response**: `{ authenticated: true/false }`
**Note**: Always returns boolean (never throws)

---

### 2. dashboardService.js
Dashboard data operations

#### `getDashboardName()`
Get user name (lightweight endpoint)

```jsx
import { getDashboardName } from "../../services/dashboardService";

try {
  const user = await getDashboardName();
  // Returns: { id, name, email }
} catch (err) {
  console.error(err.message);
}
```

**API Endpoint**: GET `/api/dashboard/name`
**Use Case**: Navbar quickly displays user name

#### `getDashboardData()`
Get complete dashboard data (user + financial profile)

```jsx
import { getDashboardData } from "../../services/dashboardService";

try {
  const dashboard = await getDashboardData();
  // Returns: {
  //   user: { id, name, email, ... },
  //   financialProfile: { 
  //     monthly_income, initial_balance, behavior_profile, ...
  //   },
  //   ...
  // }
} catch (err) {
  console.error(err.message);
}
```

**API Endpoint**: GET `/api/dashboard`
**Use Case**: Initial dashboard load with all data

#### `getDashboardInvestments()`
Get investment data only

```jsx
import { getDashboardInvestments } from "../../services/dashboardService";

try {
  const investments = await getDashboardInvestments();
  // Returns: {
  //   investments: [ { id, name, amount, type, ... }, ... ],
  //   total: 1000000,
  //   ...
  // }
} catch (err) {
  console.error(err.message);
}
```

**API Endpoint**: GET `/api/dashboard/investments`
**Use Case**: Investment-specific dashboard view

---

### 3. despesaService.js
Expense management operations

#### `getExpenses()`
Fetch all user expenses

```jsx
import { getExpenses } from "../../services/despesaService";

try {
  const result = await getExpenses();
  // Returns: {
  //   expenses: [ { id, description, category, amount, date, ... }, ... ],
  //   total: 5000,
  //   ...
  // }
} catch (err) {
  console.error(err.message);
}
```

**API Endpoint**: GET `/api/despesas`
**Query Parameters**: (add as needed: page, limit, category, month)

#### `getExpense(id)`
Fetch single expense

```jsx
import { getExpense } from "../../services/despesaService";

try {
  const expense = await getExpense(123);
  // Returns: { id, description, category, amount, date, ... }
} catch (err) {
  console.error(err.message); // "Expense not found"
}
```

**API Endpoint**: GET `/api/despesas/:id`

#### `createExpense(expenseData)`
Create new expense

```jsx
import { createExpense } from "../../services/despesaService";

try {
  const newExpense = await createExpense({
    description: "Monthly rent",
    category: "housing",
    amount: 1500,
    date: "2024-03-01"
  });
  // Returns: { id, description, category, amount, date, createdAt, ... }
} catch (err) {
  console.error(err.message);
}
```

**API Endpoint**: POST `/api/despesas`
**Body**: `{ description, category, amount, date }`

#### `updateExpense(id, expenseData)`
Update existing expense

```jsx
import { updateExpense } from "../../services/despesaService";

try {
  const updated = await updateExpense(123, {
    description: "Updated description",
    amount: 2000
  });
} catch (err) {
  console.error(err.message); // "Expense not found"
}
```

**API Endpoint**: PUT `/api/despesas/:id`

#### `deleteExpense(id)`
Delete expense

```jsx
import { deleteExpense } from "../../services/despesaService";

try {
  await deleteExpense(123);
  // Returns nothing (just success)
} catch (err) {
  console.error(err.message); // "Expense not found"
}
```

**API Endpoint**: DELETE `/api/despesas/:id`

---

### 4. investimentoService.js
Investment management operations

#### `getInvestments()`
Fetch all user investments

```jsx
import { getInvestments } from "../../services/investimentoService";

try {
  const result = await getInvestments();
  // Returns: {
  //   investments: [ { id, name, type, amount, rate, ... }, ... ],
  //   total: 100000,
  //   ...
  // }
} catch (err) {
  console.error(err.message);
}
```

**API Endpoint**: GET `/api/investimentos`

#### `getInvestment(id)`
Fetch single investment

```jsx
import { getInvestment } from "../../services/investimentoService";

try {
  const investment = await getInvestment(456);
  // Returns: { id, name, type, amount, rate, date, ... }
} catch (err) {
  console.error(err.message); // "Investment not found"
}
```

**API Endpoint**: GET `/api/investimentos/:id`

#### `createInvestment(investmentData)`
Create new investment

```jsx
import { createInvestment } from "../../services/investimentoService";

try {
  const newInvestment = await createInvestment({
    name: "Stock Portfolio",
    type: "stocks",
    amount: 10000,
    rate: 0.8
  });
  // Returns: { id, name, type, amount, rate, createdAt, ... }
} catch (err) {
  console.error(err.message);
}
```

**API Endpoint**: POST `/api/investimentos`

#### `updateInvestment(id, investmentData)`
Update existing investment

```jsx
import { updateInvestment } from "../../services/investimentoService";

try {
  const updated = await updateInvestment(456, {
    amount: 12000,
    rate: 1.2
  });
} catch (err) {
  console.error(err.message); // "Investment not found"
}
```

**API Endpoint**: PUT `/api/investimentos/:id`

#### `deleteInvestment(id)`
Delete investment

```jsx
import { deleteInvestment } from "../../services/investimentoService";

try {
  await deleteInvestment(456);
  // Returns nothing (just success)
} catch (err) {
  console.error(err.message); // "Investment not found"
}
```

**API Endpoint**: DELETE `/api/investimentos/:id`

---

## Error Handling

### Common Error Patterns

```jsx
try {
  const result = await service.operation();
} catch (error) {
  // error is Error object with message from backend
  // Examples:
  // "Invalid credentials"
  // "Email already registered"
  // "Token not found"
  // "Not found"
  
  // Always throw to let page handle display
  setError(error.message);
}
```

### HTTP Status Codes

| Code | Meaning | Service Behavior |
|------|---------|------------------|
| 200 | OK | Return data |
| 201 | Created | Return created resource |
| 400 | Bad Request | Throw error with message |
| 401 | Unauthorized | Throw "Token invalid or expired" |
| 403 | Forbidden | Throw "Access denied" |
| 404 | Not Found | Throw "Not found" |
| 409 | Conflict | Throw "Email already registered" |
| 500 | Server Error | Throw "Server error" |

### Logging in Services

Services log all major operations:

```jsx
// Success
logger.info({}, "Operation succeeded");

// Warning
logger.warn({}, "Operation failed: Invalid input");

// Error
logger.error({ error: err.message }, "Network request failed");
```

View logs in browser: Navigate to `/logs` in authenticated app

---

## Request/Response Format

### Standard Request
```jsx
const response = await fetch(url, {
  method: "POST",                      // GET, POST, PUT, DELETE
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}` // Only if authenticated
  },
  body: JSON.stringify(data)           // For POST/PUT
});
```

### Standard Response (Success)
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "Value",
    ...
  }
}
```

### Standard Response (Error)
```json
{
  "success": false,
  "message": "Invalid input",
  "errors": [
    { "field": "email", "message": "Invalid format" }
  ]
}
```

---

## Usage in Pages

### Complete Example: Fetch Data on Mount
```jsx
// pages/app/Dashboard.jsx
import { getDashboardData } from "../../services/dashboardService";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getDashboardData();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <Alert type="error">{error}</Alert>;
  if (!data) return <div>No data</div>;

  return <div>{/* Display data */}</div>;
}
```

### Form Submission Example
```jsx
import { createExpense } from "../../services/despesaService";
import { validateExpenseForm } from "../../validators/financialProfileValidator";

function CreateExpense() {
  const [formData, setFormData] = useState({ description: "", amount: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate
    const validationError = validateExpenseForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const newExpense = await createExpense(formData);
      // Reset form or navigate
      setFormData({ description: "", amount: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <Alert type="error">{error}</Alert>}
      <Button disabled={isLoading}>Create</Button>
    </form>
  );
}
```

---

## Best Practices

### ✅ DO

- Keep functions simple and focused
- Handle all errors with try-catch
- Log important operations
- Include detailed JSDoc comments
- Use consistent naming
- Return parsed data objects
- Always throw on error for page to handle

### ❌ DON'T

- Add business logic to services
- Manage UI state
- Make routing decisions
- Duplicate error handling
- Mix serialization/deserialization 
- Modify response data extensively
- Catch and swallow errors silently

---

## Adding New Services

### 1. Create new file
```bash
src/services/newFeatureService.js
```

### 2. Follow template
```jsx
/**
 * New Feature Service
 * 
 * Description of what this service does
 * 
 * @module newFeatureService
 */

import logger from "../utils/logger";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Operation description
 * 
 * @async
 * @param {type} param - Description
 * @returns {Promise<Object>} Description of return value
 * @throws {Error} Possible error cases
 */
export async function operation(param) {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "Service: Token not found");
      throw new Error("Token not found");
    }

    logger.debug({}, "Service: Starting operation");

    const response = await fetch(`${API_URL}/endpoint`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({}, `Service: Operation failed - ${data.message}`);
      throw new Error(data.message || "Error");
    }

    logger.info({}, "Service: Operation succeeded");
    return data.data;
  } catch (error) {
    logger.error({ error: error.message }, "Service: Error on operation");
    throw error;
  }
}
```

### 3. Export and use in pages
```jsx
import { operation } from "../../services/newFeatureService";

const result = await operation(param);
```

---

## Testing Services

Recommended patterns for testing services (Jest + fetch-mock):

```jsx
describe("authService", () => {
  it("should login successfully", async () => {
    // Mock fetch
    // Call login()
    // Assert response
  });

  it("should handle login error", async () => {
    // Mock fetch with error
    // Expect error thrown
  });
});
```

---

## Related Documentation

- [Frontend Architecture](./ARCHITECTURE.md)
- [Frontend Validators](./VALIDATORS.md)
- [Logger](../src/utils/logger.js) - Service logging
- [Backend Endpoints](../../backend/docs/ROUTES_AND_MIDDLEWARES.md)

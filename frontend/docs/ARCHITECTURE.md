# Frontend Architecture - React Components & State Management

## Overview

The frontend is a **React-based single-page application (SPA)** built with Vite. It follows a component-based architecture with separated concerns:

```
HTTP Request (API Call)
    ↓
SERVICE (API Integration)
    ├─ authService (Login/Register)
    ├─ investmentService (Investments)
    ├─ expenseService (Expenses)
    └─ userService (User data)
    ↓
RESPONSE (JSON from backend)
    ↓
COMPONENT (React)
    ├─ Fetch data via useEffect()
    ├─ Manage state via useState()
    ├─ Render UI
    └─ Handle user interactions
```

## Project Structure

```
frontend/src/
├── components/             # Reusable UI components
│   ├── Button/
│   │   └── index.jsx       # Reusable button (primary/secondary/danger types)
│   ├── Input/
│   │   └── index.jsx       # Input field with label & error message
│   ├── Card/
│   │   └── index.jsx       # Card container component
│   ├── Alert/
│   │   └── index.jsx       # Alert notifications (error/success/info/warning)
│   └── Navbar/
│       └── index.jsx       # Top navigation with user info
├── pages/                  # Page components (full-screen views)
│   ├── auth/
│   │   ├── Login.jsx       # Email + password login
│   │   ├── Register.jsx    # User registration (name, email, cpf, phone, password)
│   │   └── FinancialProfile.jsx  # Post-signup financial profile setup
│   └── app/
│       └── Dashboard.jsx   # Main dashboard (authenticated users)
├── services/               # API integration layer
│   ├── authService.js      # Auth API calls (login, register, logout, getMe)
│   ├── investmentService.js # Investment API calls
│   ├── expenseService.js   # Expense API calls
│   └── userService.js      # User data API calls
├── App.jsx                 # Router configuration
├── main.jsx                # React entry point
├── assets/
│   ├── icons/
│   └── images/
├── style/
│   └── css/                # Global styles (Tailwind)
└── docs/
    ├── ARCHITECTURE.md     # This file
    └── COMPONENTS.md       # Component documentation

```

## Layer Responsibilities

### 1. Service Layer (API Integration)
**File:** `src/services/*.js`

**Responsibility:** Communicate with backend API

**Pattern:**
```javascript
export const authService = {
  async login(email, password) {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
  
  async register(name, email, cpf, phone, password) {
    // Similar to login
  },
  
  async logout() {
    // Clear token
  },
  
  async getMe() {
    // Get authenticated user
  }
};
```

### 2. Component Layer (React)
**Files:** `src/components/*.jsx`, `src/pages/**/*.jsx`

**Responsibility:**
- Render UI
- Manage component state (useState)
- Fetch data (useEffect)
- Handle user interactions
- Call services when needed

**Pattern:**
```javascript
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  async function handleFormSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await authService.login(email, password);
      sessionStorage.setItem('token', result.token);
      // Redirect to dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <form onSubmit={handleFormSubmit}>
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
      {error && <Alert type="error" message={error} />}
      <Button type="primary" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
```

## Authentication Flow

### Login Flow
```
1. User enters email + password
   ↓
2. Click "Sign In" button
   ↓
3. handleFormSubmit() triggered
   ↓
4. Call authService.login(email, password)
   ↓
5. Service sends HTTP POST to http://localhost:3000/auth/login
   ↓
6. Backend validates data + checks credentials
   ↓
7. Backend returns { user, token } or error
   ↓
8. Frontend receives response
   ↓
9. Save token to sessionStorage.setItem('token', token)
   ↓
10. Clear form + redirect to Dashboard
   ↓
11. Dashboard fetches user data with token in Authorization header
```

### Protected Routes
```javascript
// In App.jsx
function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
```

## Component Descriptions

### Pages

#### Login.jsx
**Purpose:** User authentication
**State:**
- `email` - User email
- `password` - User password
- `error` - Error message display
- `isLoading` - Loading state during login

**Flow:**
1. User enters credentials
2. Click "Sign In"
3. Call `authService.login()`
4. Save token if successful
5. Redirect to dashboard

**UI Elements:**
- Input: Email field
- Input: Password field
- Alert: Error display
- Button: Sign In

#### Register.jsx
**Purpose:** New user registration
**State:**
- `name` - Full name
- `email` - Email address
- `cpf` - CPF (Brazilian ID)
- `phone` - Phone number
- `password` - Password
- `error` - Error message
- `isLoading` - Loading state

**Flow:**
1. User fills all fields
2. Click "Sign Up"
3. Call `authService.register()`
4. Save user ID to sessionStorage
5. Redirect to FinancialProfile page

**Validation:** All done by backend validators

#### FinancialProfile.jsx
**Purpose:** Post-signup financial profile setup
**State:**
- `monthlyIncome` - Monthly income
- `initialBalance` - Initial balance
- `hasInvestments` - Has investments? (checkbox)
- `hasAssets` - Has assets? (checkbox)
- `financialGoal` - Financial goal (select dropdown)
- `behaviorProfile` - Investor type (select dropdown: conservative/moderate/aggressive)
- `error` - Error message
- `isLoading` - Loading state

**Form Fields:**
- Input: Monthly Income
- Input: Initial Balance
- Checkbox: Do you have investments?
- Checkbox: Do you have assets?
- Select: Financial Goal
- Select: Behavior Profile (Conservative/Moderate/Aggressive)

**Flow:**
1. User fills financial profile
2. Click "Continue"
3. Call API POST with all data
4. Save to database
5. Redirect to Dashboard

#### Dashboard.jsx
**Purpose:** Main application view
**State:**
- `user` - Current logged-in user data
- `error` - Error message
- `isLoading` - Loading state

**Flow:**
1. Component mounts
2. useEffect() fetches user data via `authService.getMe()`
3. Display user greeting
4. Show financial stats (balance, investments, expenses, assets)
5. Show navigation cards to other pages

**Display:**
- Welcome message with user name
- Total balance card
- Investments card
- Expenses card
- Assets card
- Navigation buttons to other pages

### Reusable Components

#### Button.jsx
**Props:**
- `type` - Button style (primary, secondary, danger)
- `onClick` - Click handler
- `disabled` - Disabled state
- `children` - Button text/content

**Example:**
```jsx
<Button type="primary" onClick={handleSubmit} disabled={isLoading}>
  Submit
</Button>
```

#### Input.jsx
**Props:**
- `label` - Input label
- `type` - Input type (text, email, password, number)
- `value` - Current value
- `onChange` - Change handler
- `error` - Error message (if any)
- `placeholder` - Placeholder text

**Example:**
```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
/>
```

#### Card.jsx
**Props:**
- `children` - Card content
- `className` - Additional CSS classes

**Example:**
```jsx
<Card>
  <h3>Total Balance</h3>
  <p>R$ 10,000.00</p>
</Card>
```

#### Alert.jsx
**Props:**
- `type` - Alert type (error, success, info, warning)
- `message` - Alert message

**Example:**
```jsx
<Alert type="error" message="Invalid credentials" />
```

#### Navbar.jsx
**Props:**
- `userEmail` - Current user email
- `onLogout` - Logout handler

**Example:**
```jsx
<Navbar 
  userEmail={user?.email} 
  onLogout={handleLogoutClick} 
/>
```

## Service Layer Details

### authService.js
```javascript
export const authService = {
  // User login
  async login(email, password) {
    // POST to /auth/login
    // Returns: { user { id, name, email }, token }
  },
  
  // User registration
  async register(name, email, cpf, phone, password) {
    // POST to /auth/register
    // Returns: { user { id, name, email }, token }
  },
  
  // User logout
  async logout() {
    // POST to /auth/logout
    // Clears token from sessionStorage
  },
  
  // Get authenticated user
  async getMe() {
    // GET to /auth/me
    // Requires Authorization header with token
    // Returns: { user { id, name, email, cpf, phone, created_at } }
  },
  
  // Check if user is authenticated
  async checkAuth() {
    // GET to /auth/check
    // Returns: { authenticated: boolean, user? }
  }
};
```

### investmentService.js
```javascript
export const investmentService = {
  async getAll() {
    // GET /investments - fetch all user investments
  },
  
  async create(investmentData) {
    // POST /investments - create new investment
  },
  
  async update(id, investmentData) {
    // PUT /investments/:id - update investment
  },
  
  async delete(id) {
    // DELETE /investments/:id - delete investment
  }
};
```

### expenseService.js
```javascript
export const expenseService = {
  async getAll() {
    // GET /expenses - fetch all user expenses
  },
  
  async create(expenseData) {
    // POST /expenses - create new expense
  },
  
  async update(id, expenseData) {
    // PUT /expenses/:id - update expense
  },
  
  async delete(id) {
    // DELETE /expenses/:id - delete expense
  }
};
```

## State Management Pattern

### Component State
```javascript
const [user, setUser] = useState(null);
const [error, setError] = useState('');
const [isLoading, setIsLoading] = useState(false);
```

### Session Storage (Token)
```javascript
// Save after login
sessionStorage.setItem('token', result.token);

// Retrieve when needed
const token = sessionStorage.getItem('token');

// Clear on logout
sessionStorage.removeItem('token');
```

## API Communication

### Making Requests
```javascript
// All services follow this pattern
const response = await fetch('http://localhost:3000/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // Include for protected routes
  },
  body: JSON.stringify(data)
});

const result = await response.json();

if (!response.ok) {
  throw new Error(result.message);
}

return result;
```

### Error Handling
```javascript
try {
  const result = await authService.login(email, password);
  // Success handling
} catch (error) {
  // error.message contains backend error message
  setError(error.message);
}
```

## Styling

**Framework:** Tailwind CSS

**Classes used:**
- `.auth-form` - Form container in auth pages
- `.btn-full` - Full-width button
- `.card` - Card container style
- `.input-group` - Input wrapper with label

## Environment Configuration

**File:** `.env`
```
VITE_API_URL=http://localhost:3000
```

**Usage:**
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const response = await fetch(`${apiUrl}/auth/login`, {...});
```

## Data Flow Example: User Registration

```
User Input (Register.jsx)
    ↓
State Update via onChange
    ↓
User clicks "Sign Up"
    ↓
handleFormSubmit() called
    ↓
Call authService.register(name, email, cpf, phone, password)
    ↓
Service validates with backend validators
    ↓
If valid: Save token, redirect to FinancialProfile
    ↓
If invalid: Display error message in component
```

## Best Practices

✅ **Separation Concerns**
- Services handle API calls only
- Components handle UI and state
- No API calls in components (only via services)

✅ **Error Handling**
- All errors displayed to user
- No silent failures
- Clear error messages

✅ **Loading States**
- Show loading indicator during async operations
- Disable buttons during submission
- Prevent double submissions

✅ **Token Management**
- Store in sessionStorage (cleared on browser close)
- Include in Authorization header for protected routes
- Clear on logout

✅ **Code Organization**
- Reusable components in `/components`
- Page components in `/pages`
- API calls in `/services`
- Styling in `/style`

## Common Patterns

### Form Submission with Loading State
```javascript
async function handleFormSubmit(event) {
  event.preventDefault();
  setIsLoading(true);
  setError('');
  
  try {
    const result = await someService.doSomething(data);
    // Success handling
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}
```

### Fetching Data on Component Mount
```javascript
useEffect(() => {
  async function fetchData() {
    try {
      setIsLoading(true);
      const result = await authService.getMe();
      setUser(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  fetchData();
}, []); // Empty dependency array = runs only on mount
```

## Summary

The frontend:
- ✅ Uses React with Hooks (useState, useEffect)
- ✅ Separates API calls into services
- ✅ Manages state locally in components
- ✅ Uses sessionStorage for authentication token
- ✅ Reusable component library
- ✅ Clear error handling and loading states
- ✅ Protected routes for authenticated users

This ensures a clean, maintainable, and user-friendly frontend application.

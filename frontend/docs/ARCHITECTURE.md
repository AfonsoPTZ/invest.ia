# Frontend Architecture - React + Vite

## Overview

Modern React single-page application (SPA) built with Vite. Structured with clear separation of concerns:
- **Pages** → **Validators** → **Components** → **Services** → **API**

Flow: User interacts with Page → Page validates input with Validators → Page renders Components → Components call Services → Services make HTTP requests to API

## Stack

- **Framework**: React 19.2.4
- **Build Tool**: Vite 8.0.1
- **Router**: React Router 7.13.2
- **Styling**: Tailwind CSS 4.2.2
- **API Communication**: Fetch API (no external HTTP library)

## Directory Structure

```
frontend/src/
├── pages/                          # Full-page components (routes)
│   ├── auth/
│   │   ├── Login.jsx               # User login form
│   │   ├── Register.jsx            # User registration
│   │   ├── VerifyOtp.jsx           # Email OTP verification
│   │   └── FinancialProfile.jsx    # Complete profile setup
│   └── app/
│       ├── Dashboard.jsx           # Main dashboard (authenticated)
│       └── Logs.jsx                # Real-time frontend logs viewer
│
├── components/                     # Reusable UI components
│   ├── Button/                     # Generic button component
│   ├── Input/                      # Form input field
│   ├── Card/                       # Container box
│   ├── Alert/                      # Alert/notification
│   ├── Navbar/                     # Top navigation bar
│   └── LogViewer/                  # Real-time log display
│
├── services/                       # HTTP API clients
│   ├── authService.js              # Authentication API
│   ├── dashboardService.js         # Dashboard data API
│   ├── despesaService.js           # Expense management API
│   └── investimentoService.js      # Investment management API
│
├── validators/                     # Frontend input validators
│   ├── sharedValidator.js          # Reusable validators
│   ├── authValidator.js            # Auth form validators
│   └── financialProfileValidator.js # Financial form validators
│
├── utils/                          # Helper utilities
│   ├── logger.js                   # Centralized logging (console + store)
│   └── logStore.js                 # In-memory log storage
│
├── styles/                         # CSS stylesheets
│   ├── globals.css                 # Global styling
│   ├── auth.css                    # Auth pages styling
│   ├── app.css                     # App pages styling
│   └── forms.css                   # Form styling
│
├── assets/                         # Static files
│   ├── icons/
│   └── images/
│
├── App.jsx                         # Router configuration
└── main.jsx                        # React entry point
```

## Layer Responsibilities

### Pages (Full-page Components)
**Purpose**: Orchestrate page layout, state management, and business logic flow

**Responsibilities**:
- Manage page-level state with `useState`
- Handle page lifecycle with `useEffect`
- Fetch and display data
- Orchestrate form submissions
- Call validators before API calls
- Handle navigation and redirects
- Compose components into complete pages

**Example**: `pages/auth/Login.jsx`
- Collects email and password
- Validates inputs with `validateLoginForm()`
- Calls `authService.login()`
- Stores token in localStorage
- Redirects to dashboard

### Components (Reusable UI)
**Purpose**: Render UI elements with consistent styling

**Responsibilities**:
- Accept props for rendering
- Handle simple UI interactions
- Apply Tailwind CSS styling
- Support common prop patterns (className, disabled, etc)

**Available Components**:
- **Button**: Primary/secondary/danger styles
- **Input**: Text field with label and error display
- **Card**: Container box for grouping content
- **Alert**: Error/success/info/warning notifications
- **Navbar**: Top navigation bar with user info
- **LogViewer**: Real-time log display with filtering

### Services (HTTP Clients)
**Purpose**: Centralize API communication

**Responsibilities**:
- Make HTTP fetch requests
- Manage Authorization headers
- Handle request/response serialization
- Transform errors to consistent format
- Log API interactions
- Retrieve and store tokens

**Available Services**:
- **authService**: login, register, logout, getMe, checkAuth
- **dashboardService**: getDashboardName, getDashboardData, getDashboardInvestments
- **despesaService**: getExpenses, getExpense, createExpense, updateExpense, deleteExpense
- **investimentoService**: getInvestments, getInvestment, createInvestment, updateInvestment, deleteInvestment

### Validators (Input Validation)
**Purpose**: Quick frontend validation for better UX

**Responsibilities**:
- Check required fields
- Validate input format (email, phone, CPF)
- Verify password strength
- Check field matches
- Return error messages

**Available Validators**:
- **sharedValidator.js**:
  - `validateNotEmpty()` - Check if value exists
  - `validateEmail()` - Email format
  - `validatePassword()` - Min 6 characters
  - `validatePasswordMatch()` - Confirm password
  - `validateNumber()` - Valid positive number
  - `validateCPF()` - 11 digits
  - `validatePhone()` - 11 digits
  - `validateOTP()` - 6 digits

- **authValidator.js**:
  - `validateLoginForm()` - Email + password
  - `validateRegisterForm()` - All registration fields
  - `validateOTPCode()` - 6-digit code
  - `validateFinancialProfileForm()` - Financial data

- **financialProfileValidator.js**:
  - `validateInvestmentForm()` - Investment data
  - `validateExpenseForm()` - Expense data
  - `validateAssetForm()` - Asset data
  - `validateIncomeForm()` - Income data

## Data Flow - User Registration

```
User enters registration data
         ↓
🔍 validateRegisterForm(data)
         ↓ (if valid)
📤 fetch /auth/register-with-otp
         ↓
✅ Backend returns userId + sends OTP email
         ↓
👁️ Redirect to /verify-otp (pass userId, email in state)
         ↓
User enters 6-digit OTP code
         ↓
🔍 validateOTPCode(otp)
         ↓ (if valid)
📤 fetch /auth/verify-email (with userId, otpCode)
         ↓
✅ Backend validates OTP + returns temporary token
         ↓
💾 Store tempToken in sessionStorage
         ↓
👁️ Redirect to /financial-profile (pass token in state)
         ↓
User fills financial profile details
         ↓
🔍 validateFinancialProfileForm(data)
         ↓ (if valid)
📤 fetch /perfil-financeiro (with Bearer tempToken)
         ↓
✅ Backend creates profile + completes registration
         ↓
🧹 Clear sessionStorage
         ↓
👁️ Redirect to /login
```

## Authentication & Token Management

### JWT Token Storage

| Token Type | Storage | Purpose | Lifecycle |
|-----------|---------|---------|-----------|
| **Login Token** | `localStorage` | All authenticated requests | Persists until logout |
| **Temp Profile Token** | `sessionStorage` | Only for `/perfil-financeiro` | Expires when browser tab closes |

### Token Usage in Requests
```jsx
// Authenticated request
const token = localStorage.getItem("token");
const response = await fetch(url, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});

// Temporary token (profile setup)
const tempToken = sessionStorage.getItem("tempProfileToken");
const response = await fetch(url, {
  headers: {
    "Authorization": `Bearer ${tempToken}`
  }
});
```

## Validation Strategy

### Frontend Validation (UX Layer)
**When**: Before sending request to API
**What**: Quick, lightweight checks

- Required fields
- Email format
- Password minimum length (6 chars)
- Field matching (e.g., password confirmation)
- CPF/phone digit count
- Number ranges

### Backend Validation (Security Layer)
**When**: Server-side processing
**What**: Authoritative business rules

- Email uniqueness (database check)
- CPF/phone uniqueness (database check)
- Password strength algorithm
- Complex business logic rules
- Rate limiting
- Database constraints

**Decision**: Backend validation is always the source of truth. Frontend validation is only for UX improvement.

## Logging System

### Frontend Logger
**Location**: `utils/logger.js`

**Features**:
- Structured logging with context
- Consistent interface with backend logger
- Color-coded console output (styled badges)
- Integration with log store for real-time viewing

**Usage**:
```jsx
import logger from "../utils/logger";

logger.debug({ operationId }, "Detailed operation info");
logger.info({ userId, email }, "User logged in");
logger.warn({ email }, "Email not found in database");
logger.error({ error: err.message }, "API request failed");
```

**Output**:
```
[14:32:45.123] DEBUG: Detailed operation info | { operationId: "abc123" }
[14:32:46.456] INFO: User logged in | { userId: 1, email: "user@example.com" }
[14:32:47.789] WARN: Email not found in database | { email: "test@example.com" }
[14:32:48.012] ERROR: API request failed | { error: "Network error" }
```

### Log Store (In-Memory)
**Location**: `utils/logStore.js`

**Features**:
- Stores up to 500 recent logs in memory (FIFO removal)
- Real-time subscriber system
- Filtering by log level
- Statistics tracking
- Export as CSV/JSON

**Usage**:
```jsx
import { logStore } from "../utils/logStore";

// Get all logs
const allLogs = logStore.getLogs();

// Get only errors
const errors = logStore.getLogs("error");

// Subscribe to real-time updates
const unsubscribe = logStore.subscribe((logs) => {
  console.log("Logs updated:", logs);
});

// Get statistics
const stats = logStore.getStats(); // { total, debug, info, warn, error }

// Export for analysis
const csv = logStore.exportCSV();
const json = logStore.exportJSON();
```

### Log Viewer Component
**Location**: `components/LogViewer/` (or Pages → `/logs`)

**Access**: Navigate to `/logs` in authenticated app

**Features**:
- Real-time log display with auto-scroll
- Filter by level (All, Debug, Info, Warn, Error)
- Export logs as CSV/JSON for analysis
- Clear log history
- Statistics panel showing log counts

**Smart Features**:
- Newest logs show first (reverse chronological)
- Color-coded by level
- Responsive design for mobile
- Smooth scrolling and animations
- Lightweight (doesn't impact app performance)

## Environment Configuration

### Environment Variables (Vite)

Create `.env` file in frontend root:
```
VITE_API_URL=http://localhost:3000/api
VITE_LOG_LEVEL=info
```

Available log levels:
- `debug` - Show all logs (most verbose)
- `info` - Default, show info and above
- `warn` - Only warnings and errors
- `error` - Only errors

### Using in Code
```jsx
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || "info";
```

## Error Handling

### Service Error Handling
All services follow consistent error pattern:

```jsx
export async function operation() {
  try {
    logger.debug({}, "Operation: Starting");
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      logger.warn({}, `Operation: Failed - ${data.message}`);
      throw new Error(data.message || "Error");
    }
    
    logger.info({}, "Operation: Success");
    return data;
  } catch (error) {
    logger.error({ error: error.message }, "Operation: Error");
    throw error; // Let page handle display
  }
}
```

### Page Error Display
```jsx
// State
const [error, setError] = useState("");

// Display
{error && <Alert type="error">{error}</Alert>}

// Calling service
try {
  const result = await operation();
  setData(result);
} catch (err) {
  setError(err.message); // Display to user
}
```

## Styling System

### Tailwind CSS
Primary styling approach using utility classes for rapid development

### Component CSS
Each component has its own scoped CSS file:
- `components/Button/style.css`
- `components/Input/style.css`
- `components/Alert/style.css`
- `components/Card/style.css`
- `components/Navbar/style.css`
- `components/LogViewer/style.css`

### Page CSS
Page-specific styles:
- `styles/auth.css` - Login, Register, VerifyOtp, FinancialProfile
- `styles/app.css` - Dashboard, Logs, and app layout
- `styles/forms.css` - Form-specific utilities
- `styles/globals.css` - Global styles, reset, variables

## Pages Reference

### Auth Pages
**Flow**: Login → Register → VerifyOtp → FinancialProfile → Dashboard

1. **[Login.jsx](../src/pages/auth/Login.jsx)**
   - Email + password
   - Frontend validators: validateLoginForm()
   - Service: authService.login()
   - Stores: JWT token in localStorage
   - Next: /dashboard

2. **[Register.jsx](../src/pages/auth/Register.jsx)**
   - Name, email, CPF, phone, password, confirmPassword
   - Frontend validators: validateRegisterForm()
   - Service: Direct fetch to /auth/register-with-otp
   - Returns: userId, email
   - Next: /verify-otp (with state)

3. **[VerifyOtp.jsx](../src/pages/auth/VerifyOtp.jsx)**
   - 6-digit OTP code input
   - Frontend validators: validateOTPCode()
   - Service: Direct fetch to /auth/verify-email
   - Stores: Temporary token in sessionStorage
   - Next: /financial-profile (with token in state)
   - Features: Auto-focus inputs, backspace navigation, resend with cooldown

4. **[FinancialProfile.jsx](../src/pages/auth/FinancialProfile.jsx)**
   - Monthly income, initial balance, has_investments, has_assets
   - Financial goal (dropdown), behavior profile (dropdown)
   - Frontend validators: validateFinancialProfileForm()
   - Service: Direct fetch to /perfil-financeiro with Bearer tempToken
   - Clears: sessionStorage after success
   - Next: /login (redirect after 2s)

### App Pages
5. **[Dashboard.jsx](../src/pages/app/Dashboard.jsx)**
   - Main authenticated page
   - Services: getDashboardName(), getDashboardData()
   - Displays: User name, financial stats, navigation cards
   - Features: Loading state, redirect to /login if no token

6. **[Logs.jsx](../src/pages/app/Logs.jsx)**
   - Real-time log viewer page
   - Component: LogViewer (embedded)
   - Features: Log filtering, export, clear
   - Access: /logs (development/debugging tool)

## Running the Application

### Development
```bash
cd frontend
npm install
npm run dev
# Opens http://localhost:5173
```

### Production Build
```bash
npm run build
# Outputs to dist/ folder
npm run preview
# Test production build locally
```

### Linting
```bash
npm run lint
# ESLint with React Hooks rules
```

## Performance Tips

1. **Component Memoization**: Use React.memo() for expensive components
2. **Code Splitting**: React Router automatically splits pages
3. **API Caching**: Add caching layer to services if needed
4. **Image Optimization**: Compress and optimize assets in src/assets/
5. **Bundle Analysis**: Use `vite-plugin-visualizer` to analyze bundle

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Common Patterns

### Fetching data on page mount
```jsx
useEffect(() => {
  async function loadData() {
    try {
      const data = await service.getData();
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
  loadData();
}, []);
```

### Form handling
```jsx
const [formData, setFormData] = useState({ field: "" });

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const error = validateForm(formData);
  if (error) { setError(error); return; }
  try {
    await service.submit(formData);
  } catch (err) {
    setError(err.message);
  }
};
```

## Next Steps / Improvements

1. ✅ Add validators for frontend
2. ✅ Implement real-time log viewer
3. ⬜ Add TypeScript for type safety
4. ⬜ Add unit tests (Jest + React Testing Library)
5. ⬜ Add E2E tests (Cypress/Playwright)
6. ⬜ Add error boundary component
7. ⬜ Add offline support (Service Workers)
8. ⬜ Add analytics/tracking
9. ⬜ Optimize images and assets
10. ⬜ Add accessibility (ARIA labels)


✅ Services handle API only
✅ Components handle UI only
✅ Token stored in sessionStorage
✅ All errors caught and displayed
✅ Loading states prevent double submission
✅ Empty dependency array = mount only

## Summary

- React + Vite for fast development
- Services separate API calls from components
- Protected routes for authenticated pages
- Hooks for state (useState, useEffect)
- Tailwind CSS for styling

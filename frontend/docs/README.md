# Invest_IA Frontend Documentation

Complete guide to the React frontend application for Invest_IA investment management platform.

## 📚 Documentation Files

### 1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System Design
Complete overview of the frontend architecture, including:
- Technology stack (React 19.2.4, Vite, React Router, Tailwind CSS)
- Directory structure with all components
- Layer responsibilities (Pages, Components, Services, Validators)
- Data flow diagrams
- Authentication and token management
- Validation strategy (frontend UX vs backend security)
- Logging system documentation
- Error handling patterns

**→ Read this first** to understand the overall system design.

### 2. **[SERVICES.md](./SERVICES.md)** - HTTP API Reference
Reference guide for all service modules:
- **authService**: Authentication (login, register, logout, getMe, checkAuth)
- **dashboardService**: Dashboard data (getDashboardName, getDashboardData, getDashboardInvestments)
- **despesaService**: Expense management (CRUD operations)
- **investimentoService**: Investment management (CRUD operations)

Each function documented with: endpoint, parameters, response format, error handling, example usage.

**→ Use this when**: Making API calls, understanding endpoints, handling responses.

### 3. **[VALIDATORS.md](./VALIDATORS.md)** - Input Validation
Complete validator reference:
- **sharedValidator**: 9 generic validators (email, phone, CPF, OTP, numbers, passwords)
- **authValidator**: 4 auth-specific validators (login, register, OTP, financial profile)
- **financialProfileValidator**: 4 financial validators (investments, expenses, assets, income)

Each validator documented with: use cases, examples, validation rules.

**→ Use this when**: Adding form validation, understanding frontend validation strategy.

### 4. **[COMPONENTS.md](./COMPONENTS.md)** - UI Component Library
Reusable UI components:
- Button, Input, Card, Alert, Navbar, LogViewer
- Props, styling, customization examples

**→ Use this when**: Building new pages, needing UI components.

## 🚀 Quick Start

### Installation
```bash
cd frontend
npm install
npm run dev
# Opens http://localhost:5173
```

### Production Build
```bash
npm run build    # Creates optimized dist/ folder
npm run preview  # Preview production build
```

### Code Quality
```bash
npm run lint     # Check code style with ESLint
```

## 📂 File Structure

```
frontend/
├── src/
│   ├── pages/                # Full-screen components
│   │   ├── auth/
│   │   │   ├── Login.jsx         # Email + password login
│   │   │   ├── Register.jsx      # Registration form
│   │   │   ├── VerifyOtp.jsx     # Email OTP verification
│   │   │   └── FinancialProfile.jsx  # Complete profile
│   │   └── app/
│   │       ├── Dashboard.jsx     # Main authenticated page
│   │       └── Logs.jsx          # Logs viewer (debug page)
│   │
│   ├── components/           # Reusable UI elements
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Alert/
│   │   ├── Navbar/
│   │   └── LogViewer/           # Real-time log display
│   │
│   ├── services/             # HTTP API clients
│   │   ├── authService.js        # Authentication
│   │   ├── dashboardService.js   # Dashboard data
│   │   ├── despesaService.js     # Expense operations
│   │   └── investimentoService.js  # Investment operations
│   │
│   ├── validators/           # Input validation (frontend UX)
│   │   ├── sharedValidator.js    # Generic validators
│   │   ├── authValidator.js      # Auth validators
│   │   └── financialProfileValidator.js  # Financial validators
│   │
│   ├── utils/                # Utility modules
│   │   ├── logger.js             # Centralized logging
│   │   └── logStore.js           # In-memory log storage
│   │
│   ├── styles/               # CSS stylesheets
│   │   ├── globals.css
│   │   ├── auth.css
│   │   ├── app.css
│   │   └── forms.css
│   │
│   ├── assets/               # Images and icons
│   ├── App.jsx               # Router configuration
│   └── main.jsx              # Application entry point
│
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md       # System design
│   ├── SERVICES.md          # API reference
│   ├── VALIDATORS.md        # Validator guide
│   ├── COMPONENTS.md        # Component API
│   └── README.md            # This file
│
├── .env                      # Environment variables
├── package.json
├── vite.config.js
├── eslint.config.js
└── tailwind.config.js
```

## ⚙️ Environment Setup

Create `.env` file in `frontend/` root:

```env
VITE_API_URL=http://localhost:3000/api
VITE_LOG_LEVEL=info
```

**Variables**:
- `VITE_API_URL`: Backend API base URL
- `VITE_LOG_LEVEL`: Logging level (debug, info, warn, error)

## 🔐 Authentication Flow

### Login
```
Email + Password
  ↓
validateLoginForm() [Frontend]
  ↓
POST /auth/login [Backend]
  ↓
Store JWT Token in localStorage
  ↓
Navigate to /dashboard
```

### Registration + Email OTP
```
Fill Registration Form
  ↓
validateRegisterForm() [Frontend]
  ↓
POST /auth/register-with-otp [Backend]
  ↓
OTP Email Sent
  ↓
Enter OTP Code
  ↓
validateOTPCode() [Frontend]
  ↓
POST /auth/verify-email [Backend]
  ↓
Store Temporary Token in sessionStorage
  ↓
Complete Financial Profile
  ↓
validateFinancialProfileForm() [Frontend]
  ↓
POST /perfil-financeiro [Backend]
  ↓
Profile Complete → Redirect to Login
```

## 📋 Logging & Debugging

### View Logs in Browser
Navigate to `http://localhost:5173/logs` (must be authenticated)

**Features**:
- ✅ Real-time log display
- ✅ Filter by level (All, Debug, Info, Warn, Error)
- ✅ Export as CSV or JSON
- ✅ Auto-scroll to newest logs
- ✅ Clear history

### Browser Console
Press F12 to open DevTools console:
- Color-coded logs with badges
- Timestamps for each log entry
- Full error stack traces

### Using Logger in Code
```jsx
import logger from "../utils/logger";

logger.debug({ operationId }, "Starting operation");
logger.info({ userId }, "User logged in");
logger.warn({ field }, "Validation warning");
logger.error({ error: err.message }, "API failed");
```

All logs appear in console AND in the `/logs` page (real-time).

## 🧪 Common Patterns

### Page Component Pattern
```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { someService } from "../../services/someService";
import { validateSomeForm } from "../../validators/someValidator";
import Card from "../../components/Card";
import logger from "../../utils/logger";

function SomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const result = await someService.getData();
        setData(result);
        logger.info({}, "Data loaded");
      } catch (err) {
        setError(err.message);
        logger.error({ error: err }, "Failed to load data");
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (formData) => {
    // 1. Validate on frontend
    const validationError = validateSomeForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    // 2. Call service (backend validates)
    try {
      await someService.createData(formData);
      logger.info({ ...formData }, "Data saved");
      navigate("/next-page");
    } catch (err) {
      setError(err.message);
      logger.error({ error: err }, "Save failed");
    }
  };

  return (
    <Card>
      {error && <Alert type="error">{error}</Alert>}
      {/* Form JSX */}
    </Card>
  );
}

export default SomePage;
```

### Service Pattern
```jsx
// src/services/myService.js
import logger from "../utils/logger";

/**
 * Fetch data from API
 * @async
 * @param {string} id - Item ID
 * @returns {Promise<Object>} Item data
 * @throws {Error} If API request fails
 */
export async function getData(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/endpoint/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    logger.info({ id }, "Data fetched");
    return data;
  } catch (error) {
    logger.error({ error: error.message }, "Fetch failed");
    throw error;
  }
}
```

### Validator Pattern
```jsx
// Returns null (valid) or error string (invalid)
export function validateEmailForm(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email format";
  return null; // Valid
}
```

## 🛠️ Adding New Features

### Add a New Page
1. Create file in `src/pages/auth/` or `src/pages/app/`
2. Implement component with state and effects
3. Add route in `App.jsx`:
   ```jsx
   import NewPage from "./pages/app/NewPage";
   // In <Routes>:
   <Route path="/new-page" element={<NewPage />} />
   ```
4. Update navigation if needed (add link in Navbar)

### Add a New Service
1. Create file in `src/services/newService.js`
2. Follow the service pattern (try-catch, logging, token handling)
3. Import and use in pages

### Add a New Validator
1. Add function to relevant validator file (or create new)
2. Follow naming: `validate*Form()` or `validate*()`
3. Return null (valid) or error string (invalid)
4. Use in pages before API calls

## 🎯 Key Concepts

### Pages vs Components
- **Pages**: Full-screen components, manage state, handle logic
- **Components**: Reusable UI elements, accept props, presentational only

### Frontend vs Backend Validation
- **Frontend**: UX improvement, quick client-side checks (validators/)
- **Backend**: Security, business logic, final authority

### Token Management
- **login/register**: JWT stored in `localStorage` (persists across sessions)
- **Register OTP flow**: Temporary token in `sessionStorage` (cleared on close)

### Error Handling
- All errors caught in try-catch blocks
- Errors logged with logger
- User-friendly messages displayed in UI
- Backend errors transformed and sent to frontend

## 📊 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.4 | UI library with hooks |
| React Router | 7.13.2 | Client-side routing |
| Vite | 8.0.1 | Build tool & dev server |
| Tailwind CSS | 4.2.2 | Utility-first styling |
| ESLint | 9.39.4 | Code quality checking |

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## 📦 Available Commands

```bash
# Development
npm run dev        # Start Vite dev server on http://localhost:5173

# Production
npm run build      # Build optimized dist/ for production
npm run preview    # Preview production build locally

# Code Quality
npm run lint       # Check code style with ESLint
```

## 🔒 Security Notes

✅ **Protected**:
- JWT tokens (expires with session or after time)
- Password never stored in frontend
- API requires Bearer token authentication
- React escapes HTML (XSS prevention)

⚠️ **Important**:
- Frontend validation is for UX, NOT security
- Backend is the authority for security decisions
- Use HTTPS in production
- Consider httpOnly cookies instead of localStorage (backend change needed)

## 🐛 Troubleshooting

### "Cannot find module" error
- Run `npm install` to ensure all dependencies installed
- Check import paths match actual file locations

### "Token not found" error
- User is not authenticated
- Must complete login/registration flow first
- Check DevTools → Application → localStorage

### "CORS error" in console
- Backend doesn't allow frontend origin
- Ensure VITE_API_URL matches backend URL
- Check backend CORS configuration

### Logs not appearing in `/logs` page
- Must be authenticated and navigated to page
- Check VITE_LOG_LEVEL environment variable
- Open browser console (F12) for direct output

### Build or dev server won't start
- Delete `node_modules` and `.vite` folders
- Run `npm install` again
- Check Node.js version (18+ required)

## 📖 Next Steps

- [ ] Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
- [ ] Check [SERVICES.md](./SERVICES.md) to understand API layer
- [ ] Review [VALIDATORS.md](./VALIDATORS.md) for validation strategy
- [ ] Add new pages/features using the patterns documented
- [ ] Set up tests for new code
- [ ] Deploy to production environment

## 📞 Support

For questions about:
- React patterns: See [React Docs](https://react.dev)
- Routing: See [React Router Docs](https://reactrouter.com)
- Styling: See [Tailwind CSS Docs](https://tailwindcss.com)
- Build tool: See [Vite Docs](https://vite.dev)

---

**Last Updated**: March 2024  
**Frontend Version**: React 19.2.4  
**Documentation Version**: 2.0

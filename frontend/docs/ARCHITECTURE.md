# Frontend Architecture - React + Services

## Overview

React single-page app (SPA) with Vite. Services handle API calls, components handle UI.

```
Component → Service → API Call → Response → State Update → Render
```

## File Structure

```
frontend/src/
├── components/
│   ├── Button/ 
│   ├── Input/
│   ├── Card/
│   ├── Alert/
│   └── Navbar/
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── FinancialProfile.jsx
│   └── Dashboard.jsx
├── services/
│   ├── authService.js
│   ├── investmentService.js
│   └── expenseService.js
├── App.jsx
├── main.jsx
└── style/css/
```

## Layer Responsibilities

**Services** - API communication (fetch, error handling)
**Components** - UI rendering, form submission, state management with useState/useEffect
**Pages** - Full-page components (Login, Register, Dashboard)

## Pages

### Login.jsx
- Email + password input
- Calls `authService.login()`
- Saves token to sessionStorage
- Redirects to dashboard

### Register.jsx
- Name, email, CPF, phone, password inputs
- Calls `authService.register()`
- Redirects to FinancialProfile

### FinancialProfile.jsx
- Monthly income, initial balance, investments checkbox, assets checkbox
- Financial goal dropdown (accumulate_wealth, retirement_planning, education_funding, home_purchase, emergency_fund, debt_reduction, short_term_savings, wealth_transfer, business_expansion, other)
- Behavior profile dropdown (conservative, moderate, aggressive)

### Dashboard.jsx
- Displays user data (useEffect on mount)
- Shows balance, investments, expenses, assets cards
- Navigation to other pages

## Reusable Components

### Button
Props: `type` (primary/secondary/danger), `onClick`, `disabled`, `children`

### Input
Props: `label`, `type`, `value`, `onChange`, `error`, `placeholder`

### Card
Props: `children`, `className`

### Alert
Props: `type` (error/success/info/warning), `message`

### Navbar
Props: `userEmail`, `onLogout`

## Services

**authService** - login, register, logout, getMe, checkAuth
**investmentService** - getAll, create, update, delete
**expenseService** - getAll, create, update, delete

## Protected Routes

```javascript
function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
}
```

## State Management

- Components use `useState()` for local state
- `sessionStorage` for authentication token
- Services fetch from backend API

## API Pattern

```javascript
const response = await fetch('http://localhost:3000/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});

if (!response.ok) throw new Error(result.message);
return await response.json();
```

## Best Practices

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

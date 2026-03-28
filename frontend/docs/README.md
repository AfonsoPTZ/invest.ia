# Frontend Documentation

## Quick Navigation

### 📚 **[ARCHITECTURE.md](./ARCHITECTURE.md)**
Complete guide to the frontend architecture and data flow.

**Topics covered:**
- Component-based architecture
- Service layer (API integration)
- Authentication flow
- Protected routes
- Page components (Login, Register, Dashboard, etc.)
- Service layer functions
- State management
- Best practices

👉 **Read this first** to understand how the frontend works.

---

### 🎨 **[COMPONENTS.md](./COMPONENTS.md)**
Complete guide to the reusable component library.

**Topics covered:**
- Reusable components (Button, Input, Card, Alert, Navbar)
- Props documentation for each component
- Usage examples
- Component composition
- Styling approach (Tailwind CSS)
- Accessibility features
- Testing components
- Best practices

👉 **Read this** to learn how to use and create components.

---

## File Structure

```
frontend/src/
├── docs/
│   ├── README.md (You are here)
│   ├── ARCHITECTURE.md (Frontend architecture)
│   └── COMPONENTS.md (Component library)
├── components/
│   ├── Button/index.jsx
│   ├── Input/index.jsx
│   ├── Card/index.jsx
│   ├── Alert/index.jsx
│   └── Navbar/index.jsx
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── FinancialProfile.jsx
│   └── app/
│       └── Dashboard.jsx
├── services/
│   ├── authService.js
│   ├── investmentService.js
│   ├── expenseService.js
│   └── userService.js
├── App.jsx (Router)
├── main.jsx (Entry point)
├── assets/
└── style/
```

---

## Quick Start

### 1. Understand the Architecture
Start with [ARCHITECTURE.md](./ARCHITECTURE.md) to learn how components, services, and state work together.

### 2. Understand Components
Read [COMPONENTS.md](./COMPONENTS.md) to see the available reusable components.

### 3. Start Building
Follow these patterns when creating new features:

```
1. Create service function (if API call needed)
2. Create component
3. Use useState for local state
4. Use useEffect for data fetching
5. Call service from useEffect
6. Display data/errors using built-in components
```

---

## Data Flow

### User Registration Example
```
User fills form in Register.jsx
    ↓
Click "Sign Up" button
    ↓
handleFormSubmit() called
    ↓
Call authService.register(name, email, cpf, phone, password)
    ↓
Service sends HTTP POST to backend
    ↓
Backend validates and creates user
    ↓
Backend returns token
    ↓
Frontend saves token to sessionStorage
    ↓
Redirect to FinancialProfile page
```

### Login Example
```
User enters email + password in Login.jsx
    ↓
Click "Sign In"
    ↓
handleFormSubmit() calls authService.login()
    ↓
Service sends credentials to backend
    ↓
Backend validates and returns token
    ↓
Frontend saves token
    ↓
useEffect in Dashboard runs (protectedRoute)
    ↓
Calls authService.getMe() with token
    ↓
Displays user data
```

---

## Key Concepts

### Services (API Integration)
```javascript
// In src/services/authService.js
export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, ...);
    return await response.json();
  }
};

// Usage in component
const result = await authService.login(email, password);
sessionStorage.setItem('token', result.token);
```

### Components (UI Elements)
```javascript
import Button from './components/Button';
import Input from './components/Input';
import Card from './components/Card';

// Each component is a reusable UI element
<Input label="Email" type="email" value={email} onChange={...} />
<Button type="primary" onClick={handleSubmit}>Submit</Button>
<Card title="Info">{content}</Card>
```

### State Management
```javascript
// Local component state
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [isLoading, setIsLoading] = useState(false);

// Session storage for token
sessionStorage.getItem('token')
sessionStorage.setItem('token', token)
sessionStorage.removeItem('token')
```

### Protected Routes
```javascript
// Redirect to login if no token
function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
}
```

---

## Common Patterns

### Form with Validation
```javascript
const [formData, setFormData] = useState({
  email: '', password: ''
});
const [errors, setErrors] = useState({});
const [isLoading, setIsLoading] = useState(false);

async function handleSubmit(e) {
  e.preventDefault();
  setIsLoading(true);
  setErrors({});
  
  try {
    const result = await authService.login(
      formData.email,
      formData.password
    );
    sessionStorage.setItem('token', result.token);
  } catch (err) {
    setErrors({ general: err.message });
  } finally {
    setIsLoading(false);
  }
}
```

### Fetching Data on Mount
```javascript
useEffect(() => {
  async function fetchData() {
    try {
      const token = sessionStorage.getItem('token');
      const result = await authService.getMe(token);
      setUser(result.user);
    } catch (err) {
      setError(err.message);
    }
  }
  
  fetchData();
}, []); // Run only on component mount
```

---

## Component Usage

### Simple Form
```jsx
<Card title="Login">
  <div className="space-y-4">
    <Input
      label="Email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      error={emailError}
    />
    
    <Input
      label="Password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      error={passwordError}
    />
    
    {generalError && <Alert type="error" message={generalError} />}
    
    <Button
      type="primary"
      onClick={handleSubmit}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? 'Signing in...' : 'Sign In'}
    </Button>
  </div>
</Card>
```

---

## Common Tasks

### Add a New Page
1. Create component in `src/pages/`
2. Import services as needed
3. Use useState for state
4. Use useEffect for loading data
5. Return JSX with reusable components
6. Add route in App.jsx

### Add a New Component
1. Create folder in `src/components/`
2. Create `index.jsx`
3. Define props
4. Implement with Tailwind
5. Export component
6. Document in COMPONENTS.md

### Call Backend API
1. Add function to appropriate service
2. Use authService methods for auth
3. Include token in Authorization header (if needed)
4. Handle errors
5. Return cleaned data

---

## Styling

**Framework:** Tailwind CSS

**Common classes:**
```jsx
// Layout
className="flex items-center justify-between"
className="grid grid-cols-4 gap-4"
className="w-full max-w-md"

// Spacing
className="p-4 m-4 space-y-4"

// Colors
className="bg-blue-600 text-white hover:bg-blue-700"
className="text-red-600"

// Responsive
className="md:grid-cols-2 lg:grid-cols-4"
```

---

## Environment Variables

```
# .env file
VITE_API_URL=http://localhost:3000
```

**Usage in code:**
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Dependencies

**Core:**
- React 18+ - UI framework
- React Router - Navigation
- Vite - Build tool
- Tailwind CSS - Styling

---

## Accessibility

✅ **Semantic HTML**
```jsx
<button>Click</button> // Good
<div onClick={...}>Click</div> // Avoid
```

✅ **ARIA Labels**
```jsx
<label htmlFor="email">Email</label>
<input id="email" {...} />
```

✅ **Keyboard Navigation**
- Tab through inputs
- Enter to submit forms
- Escape to close modals

---

## Testing

```javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('button calls onClick', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  fireEvent.click(screen.getByText('Click'));
  expect(handleClick).toHaveBeenCalled();
});
```

---

## Deployment Checklist

- [ ] All components styled
- [ ] Authentication working
- [ ] Protected routes configured
- [ ] Error messages clear
- [ ] Environment variables set
- [ ] Services tested
- [ ] Responsive design checked
- [ ] Accessibility checked
- [ ] Build succeeds
- [ ] Tests pass

---

## Need Help?

1. **Understanding the structure?** → Read ARCHITECTURE.md
2. **Using components?** → Read COMPONENTS.md
3. **Following patterns?** → Look at existing pages
4. **Something not working?** → Check browser console

---

## Last Updated
March 28, 2026

## Maintainers
Frontend Team

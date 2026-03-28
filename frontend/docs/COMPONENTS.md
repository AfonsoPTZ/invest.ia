# Frontend Components - Reusable UI Library

## Overview

The frontend has a **component library** of reusable UI elements. All components follow these patterns:

```
✅ Functional components (React Hooks)
✅ Props-based configuration
✅ Styled with Tailwind CSS
✅ Consistent naming conventions
✅ Error handling built-in
```

## Component Library

### Button.jsx
**Purpose:** Reusable button element with multiple styles

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | 'primary' | Button style: 'primary' (blue), 'secondary' (gray), 'danger' (red) |
| `onClick` | function | - | Click event handler |
| `disabled` | boolean | false | Disable state |
| `children` | ReactNode | - | Button text or content |
| `className` | string | '' | Additional CSS classes |

**Usage:**
```jsx
import Button from './components/Button';

// Primary button
<Button type="primary" onClick={handleSubmit}>
  Submit
</Button>

// Secondary button
<Button type="secondary" onClick={handleCancel}>
  Cancel
</Button>

// Danger button (red)
<Button type="danger" onClick={handleDelete} disabled={isDeleting}>
  Delete Account
</Button>

// Loading state
<Button type="primary" disabled={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

**Styles:**
- **Primary:** Blue background, white text, hover effect
- **Secondary:** Gray background, dark text
- **Danger:** Red background, white text (use for destructive actions)
- **Disabled:** Opacity reduced, cursor not-allowed

---

### Input.jsx
**Purpose:** Reusable text input with label and error message

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | string | Yes | Label text (displayed above input) |
| `type` | string | Yes | Input type: 'text', 'email', 'password', 'number', 'tel' |
| `value` | string/number | Yes | Current input value |
| `onChange` | function | Yes | Change event handler |
| `error` | string | No | Error message (displayed below input in red) |
| `placeholder` | string | No | Placeholder text |
| `disabled` | boolean | No | Disable state |
| `className` | string | No | Additional CSS classes |

**Usage:**
```jsx
import Input from './components/Input';

const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

<Input
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="joao@email.com"
  error={emailError}
/>

// Password input
<Input
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// Number input
<Input
  label="Monthly Income"
  type="number"
  value={income}
  onChange={(e) => setIncome(e.target.value)}
  placeholder="0.00"
/>

// With error
<Input
  label="CPF"
  type="text"
  value={cpf}
  onChange={(e) => setCpf(e.target.value)}
  error="CPF format is invalid"
/>
```

**Validation:**
- Label shows field name
- Helper text below label (optional)
- Error text in red when validation fails
- Auto-focus on error for accessibility

---

### Card.jsx
**Purpose:** Container component for grouping content

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Card content |
| `className` | string | '' | Additional CSS classes |
| `title` | string | No | Optional card title |

**Usage:**
```jsx
import Card from './components/Card';

// Basic card
<Card>
  <h3>Total Balance</h3>
  <p>R$ 10,000.00</p>
</Card>

// Card with title
<Card title="Account Information">
  <p>Email: joao@email.com</p>
  <p>CPF: 123.456.789-10</p>
</Card>

// Dashboard layouts
<Card>
  <div className="grid grid-cols-4 gap-4">
    <Card title="Balance">R$ 10,000</Card>
    <Card title="Investments">R$ 5,000</Card>
    <Card title="Expenses">R$ 2,000</Card>
    <Card title="Assets">R$ 15,000</Card>
  </div>
</Card>
```

**Styling:**
- White background, rounded corners
- Padding for content spacing
- Border and shadow for definition
- Responsive design

---

### Alert.jsx
**Purpose:** Display notifications and messages to user

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | string | Yes | Alert type: 'error', 'success', 'info', 'warning' |
| `message` | string | Yes | Alert message text |
| `onClose` | function | No | Close handler (for dismissible alerts) |
| `dismissible` | boolean | No | Show close button (default: false) |

**Usage:**
```jsx
import Alert from './components/Alert';

// Error alert
<Alert 
  type="error" 
  message="Invalid email or password"
/>

// Success alert
<Alert 
  type="success" 
  message="Account created successfully!"
/>

// Info alert
<Alert 
  type="info" 
  message="Please complete your financial profile"
/>

// Warning alert
<Alert 
  type="warning" 
  message="Your password will expire in 30 days"
/>

// Dismissible alert
const [showAlert, setShowAlert] = useState(true);

{showAlert && (
  <Alert 
    type="success" 
    message="Changes saved successfully"
    dismissible={true}
    onClose={() => setShowAlert(false)}
  />
)}
```

**Colors:**
- **Error:** Red background, dark red text
- **Success:** Green background, dark green text
- **Info:** Blue background, dark blue text
- **Warning:** Yellow background, dark yellow text

**Features:**
- Icon matching alert type
- Auto-dismiss option (configurable timeout)
- Dismissible with close button
- Accessible (aria labels)

---

### Navbar.jsx
**Purpose:** Top navigation bar with user info and logout

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `userEmail` | string | No | Current user email to display |
| `onLogout` | function | Yes | Logout click handler |

**Usage:**
```jsx
import Navbar from './components/Navbar';

<Navbar 
  userEmail={user?.email}
  onLogout={handleLogoutClick}
/>
```

**Features:**
- App logo/title on left
- User email display in center/right
- Logout button on right
- Responsive design for mobile
- Sticky positioning (stays at top when scrolling)

---

## Component State Management

### Using Multiple Inputs
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  cpf: '',
  phone: '',
  password: ''
});

const [errors, setErrors] = useState({});
const [isLoading, setIsLoading] = useState(false);

function handleInputChange(field, value) {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
  
  // Clear error for this field
  setErrors(prev => ({
    ...prev,
    [field]: ''
  }));
}

// Usage
<Input
  label="Full Name"
  type="text"
  value={formData.name}
  onChange={(e) => handleInputChange('name', e.target.value)}
  error={errors.name}
/>

<Input
  label="Email"
  type="email"
  value={formData.email}
  onChange={(e) => handleInputChange('email', e.target.value)}
  error={errors.email}
/>
```

---

## Component Composition

### Building Complex Forms
```jsx
function RegistrationForm() {
  const [formData, setFormData] = useState({...});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.register(
        formData.name,
        formData.email,
        formData.cpf,
        formData.phone,
        formData.password
      );
      // Success
    } catch (error) {
      // Parse errors and set them
      const errorMessages = error.message.split(', ');
      setErrors(parseBackendErrors(errorMessages));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card title="Create Account">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
          />
          
          <Input
            label="CPF"
            type="text"
            value={formData.cpf}
            onChange={(e) => handleInputChange('cpf', e.target.value)}
            error={errors.cpf}
            placeholder="123.456.789-10"
          />
          
          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone}
            placeholder="(11) 98765-4321"
          />
          
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
          />
          
          <Button 
            type="primary" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
```

---

## Styling Approach

**Framework:** Tailwind CSS

### Common Classes
```jsx
// Spacing
<div className="p-4">Padding</div>
<div className="m-4">Margin</div>
<div className="space-y-4">Items with vertical gap</div>

// Layout
<div className="flex items-center justify-between">Row layout</div>
<div className="grid grid-cols-4 gap-4">4-column grid</div>

// Sizing
<div className="w-full">Full width</div>
<div className="max-w-md">Max width</div>

// Colors
<button className="bg-blue-600 text-white hover:bg-blue-700">Button</button>
<div className="text-red-600">Error text</div>

// Responsive
<div className="md:grid-cols-2 lg:grid-cols-4">Responsive grid</div>
```

---

## Accessibility Features

### Semantic HTML
```jsx
// Good
<button className="...">Click Me</button>
<input type="email" {...props} />
<label htmlFor="email">Email</label>

// Avoid
<div onClick={...}>Click Me</div>
<div>Email</div>
```

### ARIA Labels
```jsx
<button
  aria-label="Close dialog"
  onClick={onClose}
>
  ×
</button>

<input
  aria-label="Search users"
  type="text"
  placeholder="Search..."
/>

<div role="alert" className="text-red-600">
  Error message
</div>
```

---

## Component Testing Examples

### Testing Button Click
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('button calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);
  
  const button = screen.getByText('Click Me');
  fireEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('button is disabled when disabled prop is true', () => {
  render(<Button disabled>Click Me</Button>);
  
  const button = screen.getByText('Click Me');
  expect(button).toBeDisabled();
});
```

### Testing Input
```jsx
test('input updates value on change', () => {
  const handleChange = jest.fn();
  render(
    <Input 
      label="Name" 
      type="text" 
      value=""
      onChange={handleChange}
    />
  );
  
  const input = screen.getByDisplayValue('');
  fireEvent.change(input, { target: { value: 'João' } });
  
  expect(handleChange).toHaveBeenCalled();
});

test('input displays error message', () => {
  render(
    <Input 
      label="Email" 
      type="email" 
      value="invalid"
      error="Invalid email format"
      onChange={() => {}}
    />
  );
  
  expect(screen.getByText('Invalid email format')).toBeInTheDocument();
});
```

---

## Best Practices

✅ **Props Documentation**
- Document all props clearly
- Define default values
- Show usage examples

✅ **Consistency**
- All inputs use same label style
- All buttons follow same color scheme
- All alerts use same positioning

✅ **Reusability**
- Components should not know about business logic
- No hardcoded values
- Accept all necessary props

✅ **Error Handling**
- Display validation errors
- Show loading states
- Handle edge cases

✅ **Accessibility**
- Use semantic HTML
- Include ARIA labels
- Keyboard navigation support

✅ **Performance**
- Memoize expensive components with React.memo
- Use useCallback for event handlers
- Avoid unnecessary re-renders

---

## Summary

The component library provides:
- ✅ **Button** - Multiple styles for different actions
- ✅ **Input** - Form inputs with validation display
- ✅ **Card** - Container for content grouping
- ✅ **Alert** - Notification system
- ✅ **Navbar** - Top navigation

All components:
- Follow React best practices
- Are consistent in styling
- Support Tailwind CSS
- Handle user interactions cleanly
- Display errors clearly

This ensures a cohesive, professional frontend UI.

# Frontend Components - Reusable UI Library

## Overview

Reusable React components using Hooks and Tailwind CSS.

## Components

### Button
- Props: `type` (primary/secondary/danger), `onClick`, `disabled`, `children`
- Usage: `<Button type="primary" onClick={handler}>Submit</Button>`

### Input
- Props: `label`, `type`, `value`, `onChange`, `error`, `placeholder`, `disabled`
- Usage: Shows label + input + error message

### Card
- Props: `children`, `className`, `title`
- Usage: Container for grouping content

### Alert
- Props: `type` (error/success/info/warning), `message`, `dismissible`, `onClose`
- Types: Error (red), Success (green), Info (blue), Warning (yellow)

### Navbar
- Props: `userEmail`, `onLogout`
- Features: Logo, user email display, logout button

## Form Example

```jsx
const [formData, setFormData] = useState({
  name: '', email: '', cpf: '', phone: '', password: ''
});
const [errors, setErrors] = useState({});
const [isLoading, setIsLoading] = useState(false);

async function handleSubmit(e) {
  e.preventDefault();
  setIsLoading(true);
  try {
    await authService.register(...);
  } catch (err) {
    setErrors(parseErrors(err.message));
  } finally {
    setIsLoading(false);
  }
}

return (
  <Card title="Create Account">
    <form onSubmit={handleSubmit}>
      <Input label="Name" type="text" value={formData.name} 
        onChange={(e) => setFormData({...formData, name: e.target.value})} 
        error={errors.name} />
      <Input label="Email" type="email" value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})} 
        error={errors.email} />
      <Button type="primary" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Sign Up'}
      </Button>
    </form>
  </Card>
);
```

## Styling with Tailwind

```
Spacing: p-4 (padding), m-4 (margin), space-y-4 (vertical gap)
Layout: flex, grid, grid-cols-4
Sizing: w-full, max-w-md
Colors: bg-blue-600, text-red-600, hover:bg-blue-700
Responsive: md:grid-cols-2, lg:grid-cols-4
```

## Best Practices

✅ Props-based configuration
✅ No business logic in components
✅ Handle loading states
✅ Display validation errors
✅ Semantic HTML for accessibility
✅ ARIA labels for screen readers

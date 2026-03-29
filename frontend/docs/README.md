# Frontend Documentation

## Navigation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - React basics, services, components, pages
- **[COMPONENTS.md](./COMPONENTS.md)** - Reusable UI components (Button, Input, Card, Alert, Navbar)

## File Structure

```
src/
├── components/       (Button, Input, Card, Alert, Navbar)
├── pages/           (Login, Register, FinancialProfile, Dashboard)
├── services/        (authService, investmentService, expenseService)
├── App.jsx          (Router)
├── main.jsx         (Entry point)
└── style/           (Tailwind CSS)
```

## Quick Pattern

```javascript
// 1. Create state
const [data, setData] = useState('');

// 2. Fetch on mount
useEffect(() => {
  const fetch = async () => {
    try {
      const result = await someService.getdata();
      setData(result);
    } catch (err) {
      // handle error
    }
  };
  fetch();
}, []);

// 3. Render with components
<Card>
  <Input value={data} onChange={...} />
  <Button onClick={handleSubmit}>Submit</Button>
</Card>
```

## Key Stack

- React + Hooks (useState, useEffect)
- React Router (Protected routes)
- Tailwind CSS (Styling)
- localStorage/sessionStorage (Auth token)

## Commands

```bash
npm run dev       # Dev server
npm run build     # Build
npm run preview   # Preview build
npm run lint      # Lint
```

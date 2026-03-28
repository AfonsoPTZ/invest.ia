// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/globals.css";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FinancialProfile from "./pages/auth/FinancialProfile";

// App Pages
import Dashboard from "./pages/app/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/financial-profile" element={<FinancialProfile />} />
        
        {/* App Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// Frontend App Router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import "./styles/globals.css";
import "./styles/animations.css";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import FinancialProfile from "./pages/auth/FinancialProfile";

// App Pages
import Dashboard from "./pages/app/Dashboard";
import Logs from "./pages/app/Logs";
import Investments from "./pages/app/Investments";
import Assets from "./pages/app/Assets";
import Income from "./pages/app/Income";
import Expense from "./pages/app/Expense";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="dark"
      />
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/financial-profile" element={<FinancialProfile />} />
        
        {/* Application Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expense" element={<Expense />} />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
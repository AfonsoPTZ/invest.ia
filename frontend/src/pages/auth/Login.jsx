import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { validateLoginForm } from "../../validators/authValidator";
import { useAnimateOnMount } from "../../utils/useAnimations";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import "../../styles/auth.css";

/**
 * Login Page
 * 
 * User authentication form. Collects email and password.
 * Frontend validation: basic email and required field checks
 * Backend validation: password strength, account existence, credentials match
 * 
 * Flow:
 * 1. User enters email and password
 * 2. Frontend validates inputs (empty, email format)
 * 3. Calls authService.login(email, password)
 * 4. Backend validates credentials and returns JWT token
 * 5. Token stored in localStorage
 * 6. Redirects to /dashboard
 * 
 * @component
 */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Apply fade in animation to card
  const cardRef = useAnimateOnMount('animate-scale-in', 100);

  /**
   * Handle form submission
   * Validates inputs locally, then calls login service
   */
  async function handleFormSubmit(event) {
    event.preventDefault();
    setError("");

    // Frontend validation - quick checks for better UX
    const validationError = validateLoginForm(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const user = await login(email, password);
      navigate("/dashboard");
    } catch (catchError) {
      setError(catchError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      {/* Panda Mascot - Add panda-login-top.png to public folder */}
      <div className="auth-panda-wrapper">
        <img 
          src="/panda-login-top.png" 
          alt="Invest_IA Mascot"
          className="auth-panda-image"
          onError={(e) => e.target.style.display = 'none'}
        />
      </div>

      <Card className="auth-card" ref={cardRef}>
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">📊</div>
          </div>
          <h1 className="auth-title">Invest_IA</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleFormSubmit} className="auth-form">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <Alert type="error">{error}</Alert>}

          <Button type="primary" className="btn-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="auth-divider"></div>

        <p className="auth-footer">
          New here? <a href="/register" className="auth-link">Create an account</a>
        </p>
      </Card>
    </div>
  );
}

export default Login;

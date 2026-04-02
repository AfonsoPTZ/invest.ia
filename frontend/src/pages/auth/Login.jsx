import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { login } from "../../services/authService";
import { validateLoginForm } from "../../validators/authValidator";
import { useAnimateOnMount } from "../../utils/useAnimations";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import PageTransition from "../../components/PageTransition";
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
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Apply fade in animation to card
  const cardRef = useAnimateOnMount('animate-scale-in', 100);

  /**
   * Map error message to field names
   */
  const mapErrorToFields = (errorMessage) => {
    const errorMap = {
      'Email is required': 'email',
      'Please enter a valid email': 'email',
      'Password is required': 'password'
    };
    return errorMap[errorMessage] || null;
  };

  /**
   * Handle email change - update state and clear field error
   */
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
    setFieldErrors(prev => ({ ...prev, email: "" }));
  };

  /**
   * Handle password change - update state and clear field error
   */
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError("");
    setFieldErrors(prev => ({ ...prev, password: "" }));
  };

  /**
   * Handle form submission
   * Validates inputs locally, then calls login service
   */
  async function handleFormSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    // Frontend validation - quick checks for better UX
    const validationError = validateLoginForm(email, password);
    if (validationError) {
      setError(validationError);
      const fieldName = mapErrorToFields(validationError);
      if (fieldName) {
        setFieldErrors(prev => ({
          ...prev,
          [fieldName]: validationError
        }));
      }
      return;
    }

    setIsLoading(true);

    try {
      const user = await login(email, password);
      setSuccess("Login successful! Redirecting to dashboard...");
      setError("");
      
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (catchError) {
      const errorMsg = catchError.message;
      setError(errorMsg);
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="auth-container">
        {/* Panda Mascot - Add panda-login-top.png to public folder */}
        <motion.div 
          className="auth-panda-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.25 }}
        >
          <img 
            src="/panda-login-top.png" 
            alt="Invest_IA Mascot"
            className="auth-panda-image"
            onError={(e) => e.target.style.display = 'none'}
          />
        </motion.div>

        <Card className="auth-card" ref={cardRef}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.25 }}
          >
            <div className="auth-header">
              <motion.div
                className="auth-logo"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="logo-icon"><TrendingUp size={32} /></div>
              </motion.div>
              <h1 className="auth-title">
                <span className="invest-text">Invest</span>
                <span className="panda-ia-text">PandaIA</span>
              </h1>
              <p className="auth-subtitle">Sign in to your account</p>
            </div>
          </motion.div>

          <motion.form 
            onSubmit={handleFormSubmit} 
            className="auth-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.25 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={handleEmailChange}
                error={fieldErrors.email}
                autoComplete="email"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                error={fieldErrors.password}
                autoComplete="current-password"
                required
              />
            </motion.div>

            {error && <Alert type="error">{error}</Alert>}

            {success && <Alert type="success">{success}</Alert>}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button type="primary" className="btn-full" disabled={isLoading} isLoading={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </motion.div>
          </motion.form>

          <div className="auth-divider"></div>

          <motion.p 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            New here? <a href="/register" className="auth-link">Create an account</a>
          </motion.p>
        </Card>
      </div>
    </PageTransition>
  );
}

export default Login;

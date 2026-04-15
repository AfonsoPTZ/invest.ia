import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine } from "react-icons/fa";
import { motion } from "motion/react";
import { login } from "../../services/authService";
import { validateLoginForm } from "../../validators/authValidator";
import { useAnimateOnMount } from "../../utils/useAnimations";
import { useFormState } from "../../utils/useFormState";
import type { FieldErrorMap } from "../../types/api";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import PageTransition from "../../components/PageTransition";
import "../../styles/auth.css";

/**
 * Login Page (TypeScript)
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
function Login(): React.ReactElement {
  // Form state management (centralized hook)
  const { 
    error, 
    setError, 
    success, 
    setSuccess, 
    fieldErrors, 
    setFieldErrors, 
    isLoading, 
    setIsLoading 
  } = useFormState();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  
  // Apply fade in animation to card
  const cardRef = useAnimateOnMount('animate-scale-in', 100);

  /**
   * Map error message to field names
   * @param errorMessage - Error message from validation
   * @returns Field name that should show the error, or null if not field-specific
   */
  const mapErrorToFields = (errorMessage: string): keyof FieldErrorMap | null => {
    const errorMap: Record<string, keyof FieldErrorMap> = {
      'Email is required': 'email',
      'Please enter a valid email': 'email',
      'Password is required': 'password'
    };
    return errorMap[errorMessage] || null;
  };

  /**
   * Handle email change - update state and clear field error
   */
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
    setError("");
    setFieldErrors({ ...fieldErrors, email: "" });
  };

  /**
   * Handle password change - update state and clear field error
   */
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
    setError("");
    setFieldErrors({ ...fieldErrors, password: "" });
  };

  /**
   * Handle form submission
   * Validates inputs locally, then calls login service
   */
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
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
        setFieldErrors({ ...fieldErrors, [fieldName]: validationError });
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
      const errorMsg = catchError instanceof Error ? catchError.message : "An unknown error occurred";
      setError(errorMsg);
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

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
            onError={(e) => (e.currentTarget as HTMLImageElement).style.display = 'none'}
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
                <div className="logo-icon"><FaChartLine size={48} /></div>
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

            {error && <Alert type="error" onClose={() => setError("")}>{error}</Alert>}

            {success && <Alert type="success" onClose={() => setSuccess("")}>{success}</Alert>}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button type="primary" className="btn-full" disabled={isLoading} isLoading={isLoading} onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (isLoading) e.preventDefault();
              }}>
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

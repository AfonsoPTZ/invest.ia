import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "sonner";
import { register } from "../../services/authService";
import { validateRegisterForm } from "../../validators/authValidator";
import { useAnimateOnMount } from "../../utils/useAnimations";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import PageTransition from "../../components/PageTransition";
import "../../styles/auth.css";

/**
 * Register Page
 * 
 * User registration form. Collects name, email, CPF, phone, and password.
 * Frontend validation: required fields, format checks, password confirmation
 * Backend validation: email uniqueness, CPF uniqueness, password strength
 * 
 * Flow:
 * 1. User enters registration details
 * 2. Frontend validates inputs (required, format, password match)
 * 3. Calls /auth/register-with-otp endpoint
 * 4. Backend sends OTP email and returns userId
 * 5. Redirects to /verify-otp with userId and email
 * 6. User verifies OTP on next page
 * 
 * @component
 */
export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Apply scale in animation to card
  const cardRef = useAnimateOnMount('animate-scale-in', 100);

  /**
   * Map error message to field names
   */
  const mapErrorToFields = (errorMessage) => {
    const errorMap = {
      'Name is required': 'name',
      'Email is required': 'email',
      'Please enter a valid email': 'email',
      'CPF is required': 'cpf',
      'CPF must have 11 digits': 'cpf',
      'Phone is required': 'phone',
      'Phone must have 11 digits': 'phone',
      'Password must be at least 6 characters': 'password',
      'Passwords do not match': 'confirmPassword'
    };
    return errorMap[errorMessage] || null;
  };

  /**
   * Handle input change - update form state and clear field errors
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError("");
    // Clear error for this specific field when user starts typing
    setFieldErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  /**
   * Handle form submission
   * Validates locally, then sends registration request
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Frontend validation - quick checks for better UX
    const validationError = validateRegisterForm(
      formData.name,
      formData.email,
      formData.cpf,
      formData.phone,
      formData.password,
      formData.confirmPassword
    );
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
      const data = await register(
        formData.name,
        formData.email,
        formData.cpf.replace(/\D/g, ""),
        formData.phone.replace(/\D/g, ""),
        formData.password
      );

      setSuccess("Registration successful! Redirecting to verification...");
      setError("");

      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            userId: data.userId,
            email: formData.email
          }
        });
      }, 1500);

    } catch (err) {
      const errorMsg = err.message || "Unexpected error. Please try again.";
      setError(errorMsg);
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <PageTransition>
      <div className="auth-container">
        {/* Panda Mascot */}
        <motion.div 
          className="auth-panda-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <img 
            src="/panda-login-top.png" 
            alt="Invest_IA Mascot"
            className="auth-panda-image"
            onError={(e) => e.target.style.display = 'none'}
          />
        </motion.div>

        <Card className="auth-card" ref={cardRef}>
          {/* Step Indicator */}
          <motion.div 
            className="form-steps"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="step-item active">
              <div className="step-number">1</div>
              <div className="step-label">Register</div>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-label">Verify</div>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-label">Profile</div>
            </div>
          </motion.div>

          <motion.div 
            className="auth-header"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="auth-title">Create Your Account</h1>
            <p className="auth-subtitle">Join us and start managing your investments</p>
          </motion.div>
          
          {error && (
            <Alert type="error">{error}</Alert>
          )}

          {success && (
            <Alert type="success">{success}</Alert>
          )}

          <motion.form 
            onSubmit={handleSubmit} 
            className="auth-form register-form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                error={fieldErrors.name}
                disabled={isLoading}
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                error={fieldErrors.email}
                disabled={isLoading}
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="CPF"
                type="text"
                name="cpf"
                placeholder="CPF (11 digits)"
                value={formData.cpf}
                onChange={handleInputChange}
                error={fieldErrors.cpf}
                disabled={isLoading}
                maxLength="14"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                placeholder="Phone (11 digits)"
                value={formData.phone}
                onChange={handleInputChange}
                error={fieldErrors.phone}
                disabled={isLoading}
                maxLength="15"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
                error={fieldErrors.password}
                disabled={isLoading}
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={fieldErrors.confirmPassword}
                disabled={isLoading}
                required
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="primary"
                className="btn-full"
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? "Creating Account..." : "Continue to Verification"}
              </Button>
            </motion.div>
          </motion.form>

          <div className="auth-divider"></div>

          <motion.p 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Already have an account? <a href="/login" className="auth-link">Sign in instead</a>
          </motion.p>
        </Card>
      </div>
    </PageTransition>
  );
}


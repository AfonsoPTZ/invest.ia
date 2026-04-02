import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createFinancialProfile } from "../../services/financialProfileService";
import { validateFinancialProfileForm } from "../../validators/authValidator";
import { useAnimateOnMount } from "../../utils/useAnimations";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import PageTransition from "../../components/PageTransition";
import logger from "../../utils/logger";
import "../../styles/forms.css";
import "../../styles/auth.css";

/**
 * Financial Profile Setup Page
 * 
 * Final step of registration. User completes their financial profile:
 * - Monthly income (optional)
 * - Initial balance/patrimony (optional)
 * - Investment experience indicators
 * - Financial goals
 * - Behavior profile (investment risk level)
 * 
 * Frontend validation: required fields, positive numbers
 * Backend validation: business rules, data persistence
 * 
 * Flow:
 * 1. User accesses this page after OTP verification
 * 2. Temporary token from previous page is in sessionStorage
 * 3. User fills financial details
 * 4. Frontend validates inputs
 * 5. Calls /financial-profile endpoint with Bearer token
 * 6. Backend creates financial profile
 * 7. Clears session storage and redirects to login
 * 
 * @component
 */
export default function FinancialProfile() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref for scrolling to alert when success/error message appears
  const alertRef = useRef(null);

  // Apply scale in animation to card
  const cardRef = useAnimateOnMount('animate-scale-in', 100);

  const [formData, setFormData] = useState({
    monthly_income: "",
    has_monthly_income: true,
    initial_balance: "",
    has_initial_balance: true,
    has_investments: false,
    has_assets: false,
    financial_goal: "",
    behavior_profile: "moderate"
  });

  /**
   * Validate temporary token on page load
   * Token should be stored in sessionStorage after OTP verification
   * If not found, redirect to register (user needs to complete OTP first)
   */
  useEffect(() => {
    const tempToken = sessionStorage.getItem("tempProfileToken");

    if (!tempToken) {
      logger.warn({}, "FinancialProfile: Temporary token not found");
      setError("Session expired. Please register again.");
      setTimeout(() => navigate("/register"), 2000);
    }
  }, [navigate]);

  /**
   * Scroll to alert when success or error message appears
   * Only scrolls if the alert is not already visible in viewport
   */
  useEffect(() => {
    if ((success || error) && alertRef.current) {
      setTimeout(() => {
        // Check if alert is already visible in viewport
        const rect = alertRef.current?.getBoundingClientRect();
        if (rect && (rect.top < 0 || rect.top > window.innerHeight)) {
          // Alert is outside viewport, scroll to it
          alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 200);
    }
  }, [success, error]);

  /**
   * Map error message to field names
   */
  const mapErrorToFields = (errorMessage) => {
    const errorMap = {
      'Please select a financial goal': 'financial_goal',
      'Please enter a valid monthly income': 'monthly_income',
      'Please enter a valid initial balance': 'initial_balance'
    };
    return errorMap[errorMessage] || null;
  };

  /**
   * Handle form input changes - update state based on input type
   */
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    setError("");
    // Clear error for this specific field when user starts typing/changing
    setFieldErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  /**
   * Submit financial profile
   * Validates locally, then sends to backend
   */
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccess("");

    // Frontend validation - quick checks for better UX
    const validationError = validateFinancialProfileForm(formData);
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
      const tempToken = sessionStorage.getItem("tempProfileToken");
      if (!tempToken) {
        logger.warn({}, "FinancialProfile: Token not found for submission");
        throw new Error("Token not found. Please register again.");
      }

      logger.info({}, "FinancialProfile: Attempting to create financial profile");

      const profileData = {
        monthly_income: formData.has_monthly_income ? parseFloat(formData.monthly_income) || 0 : 0,
        initial_balance: formData.has_initial_balance ? parseFloat(formData.initial_balance) || 0 : 0,
        has_investments: formData.has_investments,
        has_assets: formData.has_assets,
        financial_goal: formData.financial_goal,
        behavior_profile: formData.behavior_profile
      };

      const data = await createFinancialProfile(profileData);

      logger.info({}, "FinancialProfile: Profile saved successfully. Redirecting to login");

      setSuccess("Profile saved successfully! Redirecting to login...");

      // Clear temporary session data
      sessionStorage.removeItem("tempProfileToken");
      sessionStorage.removeItem("userId");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);

    } catch (catchError) {
      logger.error({ error: catchError.message }, "FinancialProfile: Error on profile submission");
      setError(catchError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25 },
    },
  };

  return (
    <PageTransition>
      <div className="auth-container financial-profile-page">
        {/* Panda Mascot */}
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
          {/* Step Indicator */}
          <motion.div 
            className="form-steps"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="step-item completed">
              <div className="step-number"><CheckCircle2 size={20} /></div>
              <div className="step-label">Register</div>
            </div>
            <div className="step-connector completed"></div>
            <div className="step-item completed">
              <div className="step-number"><CheckCircle2 size={20} /></div>
              <div className="step-label">Verify</div>
            </div>
            <div className="step-connector"></div>
            <div className="step-item active">
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
            <h1 className="auth-title">Complete Your Profile</h1>
            <p className="auth-subtitle">
              Tell us about your financial situation so we can provide personalized recommendations.
            </p>
          </motion.div>

          {error && (
            <div ref={alertRef}>
              <Alert type="error">{error}</Alert>
            </div>
          )}

          {success && (
            <div ref={alertRef}>
              <Alert type="success">{success}</Alert>
            </div>
          )}

          <motion.form 
            onSubmit={handleFormSubmit} 
            className="auth-form financial-profile-form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
            <motion.div className="form-group" variants={itemVariants}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="has_monthly_income"
                  checked={formData.has_monthly_income}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                I have monthly income
              </label>
            </motion.div>

            {formData.has_monthly_income && (
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <Input
                  label="Monthly Income Amount (Currency)"
                  type="number"
                  name="monthly_income"
                  placeholder="5000 or 50000.00"
                  value={formData.monthly_income}
                  onChange={handleInputChange}
                  error={fieldErrors.monthly_income}
                  disabled={isLoading}
                  min="0"
                  step="0.01"
                />
              </motion.div>
            )}

            <motion.div className="form-group" variants={itemVariants}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="has_initial_balance"
                  checked={formData.has_initial_balance}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                I have initial balance / savings
              </label>
            </motion.div>

            {formData.has_initial_balance && (
              <motion.div 
                className="form-group"
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <Input
                  label="Initial Balance Amount (Currency)"
                  type="number"
                  name="initial_balance"
                  placeholder="50000 or 100000.00"
                  value={formData.initial_balance}
                  onChange={handleInputChange}
                  error={fieldErrors.initial_balance}
                  disabled={isLoading}
                  min="0"
                  step="0.01"
                />
              </motion.div>
            )}

            <motion.div className="form-group" variants={itemVariants}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="has_investments"
                  checked={formData.has_investments}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                I have active investments
              </label>
            </motion.div>

            <motion.div className="form-group" variants={itemVariants}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="has_assets"
                  checked={formData.has_assets}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                I have assets (real estate, vehicles, etc)
              </label>
            </motion.div>

            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="financial_goal" className="form-label">What is your primary financial goal?</label>
              <select
                id="financial_goal"
                name="financial_goal"
                value={formData.financial_goal}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className={`form-select ${fieldErrors.financial_goal ? 'has-error' : ''}`}
              >
                <option value="">Select your investment goal</option>
                <option value="accumulate_wealth">Accumulate wealth</option>
                <option value="retirement_planning">Retirement planning</option>
                <option value="education_funding">Fund education</option>
                <option value="home_purchase">Buy a home</option>
                <option value="emergency_fund">Emergency fund</option>
                <option value="debt_reduction">Reduce debt</option>
                <option value="short_term_savings">Short-term savings</option>
                <option value="wealth_transfer">Wealth transfer</option>
                <option value="business_expansion">Business expansion</option>
                <option value="other">Other goal</option>
              </select>
            </motion.div>

            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="behavior_profile" className="form-label">What's your investor risk profile?</label>
              <select
                id="behavior_profile"
                name="behavior_profile"
                value={formData.behavior_profile}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="form-select"
              >
                <option value="conservative">🛡️ Conservative - Low risk, stable returns</option>
                <option value="moderate">⚖️ Moderate - Balanced approach</option>
                <option value="aggressive">🚀 Aggressive - High risk, high potential returns</option>
              </select>
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
                {isLoading ? "Completing Setup..." : "Complete Registration"}
              </Button>
            </motion.div>
            </AnimatePresence>
          </motion.form>

          <motion.p 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <a href="/register" className="auth-link">Start over</a>
          </motion.p>
        </Card>
      </div>
    </PageTransition>
  );
}

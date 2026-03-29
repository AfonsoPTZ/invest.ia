import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createFinancialProfile } from "../../services/financialProfileService";
import { validateFinancialProfileForm } from "../../validators/authValidator";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import logger from "../../utils/logger";
import "../../styles/auth.css";
import "../../styles/forms.css";

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
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      setTimeout(() => navigate("/register"), 3000);
    }
  }, [navigate]);

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
  };

  /**
   * Submit financial profile
   * Validates locally, then sends to backend
   */
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Frontend validation - quick checks for better UX
    const validationError = validateFinancialProfileForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      if (!token) {
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

  return (
    <div className="auth-container">
      <Card className="auth-card">
        {/* Step Indicator */}
        <div className="form-steps">
          <div className="step-item completed">
            <div className="step-number">✓</div>
            <div className="step-label">Register</div>
          </div>
          <div className="step-connector completed"></div>
          <div className="step-item completed">
            <div className="step-number">✓</div>
            <div className="step-label">Verify</div>
          </div>
          <div className="step-connector"></div>
          <div className="step-item active">
            <div className="step-number">3</div>
            <div className="step-label">Profile</div>
          </div>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Complete Your Profile</h1>
          <p className="auth-subtitle">
            Tell us about your financial situation so we can provide personalized recommendations.
          </p>
        </div>

        {error && (
          <Alert type="error">{error}</Alert>
        )}

        {success && (
          <Alert type="success">{success}</Alert>
        )}

        <form onSubmit={handleFormSubmit} className="auth-form">
          {/* Financial Assets Section */}
          <div className="form-section">
            <h3 className="form-section-title">💰 Your Financial Assets</h3>
            
            <div className="form-group">
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
              {formData.has_monthly_income && (
                <Input
                  id="monthly_income"
                  type="number"
                  name="monthly_income"
                  label="Monthly Income Amount"
                  value={formData.monthly_income}
                  onChange={handleInputChange}
                  placeholder="Enter amount (e.g., 5000)"
                  disabled={isLoading}
                />
              )}
            </div>

            <div className="form-group">
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
              {formData.has_initial_balance && (
                <Input
                  id="initial_balance"
                  type="number"
                  name="initial_balance"
                  label="Initial Balance Amount"
                  value={formData.initial_balance}
                  onChange={handleInputChange}
                  placeholder="Enter amount (e.g., 50000)"
                  disabled={isLoading}
                />
              )}
            </div>

            <div className="form-group">
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
            </div>

            <div className="form-group">
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
            </div>
          </div>

          {/* Financial Goals Section */}
          <div className="form-section">
            <h3 className="form-section-title">🎯 Your Financial Goals</h3>
            
            <div className="form-group">
              <label htmlFor="financial_goal" className="form-label">What is your primary financial goal?</label>
              <select
                id="financial_goal"
                name="financial_goal"
                value={formData.financial_goal}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                className="form-select"
              >
                <option value="">Select your goal</option>
                <option value="accumulate_wealth">Accumulate wealth</option>
                <option value="retirement_planning">Retirement planning</option>
                <option value="education_funding">Fund education</option>
                <option value="home_purchase">Buy a home</option>
                <option value="emergency_fund">Emergency fund</option>
                <option value="debt_reduction">Reduce debt</option>
                <option value="short_term_savings">Short-term savings</option>
                <option value="wealth_transfer">Wealth transfer</option>
                <option value="business_expansion">Business expansion</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Investment Profile Section */}
          <div className="form-section">
            <h3 className="form-section-title">📊 Your Investment Profile</h3>
            
            <div className="form-group">
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
            </div>
          </div>

          <Button
            type="primary"
            className="btn-full"
            disabled={isLoading}
          >
            {isLoading ? "Completing Setup..." : "Complete Registration"}
          </Button>
        </form>

        <p className="auth-footer">
          <a href="/register" className="auth-link">Start over</a>
        </p>
      </Card>
    </div>
  );
}

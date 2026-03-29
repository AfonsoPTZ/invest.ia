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
        <h2 className="auth-title">Financial Profile</h2>
        
        <p className="auth-subtitle mb-6">
          Almost there! Complete your financial profile to get started.
        </p>

        {error && (
          <Alert type="error">{error}</Alert>
        )}

        {success && (
          <Alert type="success">{success}</Alert>
        )}

        <form onSubmit={handleFormSubmit} className="auth-form">
          {/* Monthly Income */}
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
                value={formData.monthly_income}
                onChange={handleInputChange}
                placeholder="Ex: 5000"
                disabled={isLoading}
              />
            )}
          </div>

          {/* Initial Balance / Savings */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="has_initial_balance"
                checked={formData.has_initial_balance}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              I have initial balance/savings
            </label>
            {formData.has_initial_balance && (
              <Input
                id="initial_balance"
                type="number"
                name="initial_balance"
                value={formData.initial_balance}
                onChange={handleInputChange}
                placeholder="Ex: 50000"
                disabled={isLoading}
              />
            )}
          </div>

          {/* Have Investments */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="has_investments"
                checked={formData.has_investments}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              I have investments
            </label>
          </div>

          {/* Have Assets */}
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

          {/* Objetivo Financeiro */}
          <div className="form-group">
            <label htmlFor="financial_goal">What is your financial goal? *</label>
            <select
              id="financial_goal"
              name="financial_goal"
              value={formData.financial_goal}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="form-select"
            >
              <option value="">Select a goal</option>
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

          {/* Perfil de Comportamento */}
          <div className="form-group">
            <label htmlFor="behavior_profile">What is your investor profile? *</label>
            <select
              id="behavior_profile"
              name="behavior_profile"
              value={formData.behavior_profile}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="form-select"
            >
              <option value="conservative">Conservative (low risk)</option>
              <option value="moderate">Moderate (medium risk)</option>
              <option value="aggressive">Aggressive (high risk, high return)</option>
            </select>
          </div>

          <Button
            type="submit"
            className="btn-full"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Complete Registration"}
          </Button>
        </form>

        <p className="auth-footer">
          <a href="/register">Back to registration</a>
        </p>
      </Card>
    </div>
  );
}

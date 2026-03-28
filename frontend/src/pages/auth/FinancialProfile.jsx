import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import "../../styles/auth.css";
import "../../styles/forms.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function FinancialProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    monthlyIncome: "",
    initialBalance: "",
    hasInvestments: false,
    hasAssets: false,
    financialGoal: "",
    behaviorProfile: "moderate"
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    return (
      <div className="auth-container">
        <Card className="auth-card">
          <h2 className="auth-title">Error</h2>
          <p className="auth-subtitle mb-6">
            User not found. Please sign up again.
          </p>
          <a href="/register">
            <Button type="primary" className="btn-full">
              Back to Sign Up
            </Button>
          </a>
        </Card>
      </div>
    );
  }

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/perfil-financeiro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: userId,
          monthly_income: parseFloat(formData.monthlyIncome),
          initial_balance: parseFloat(formData.initialBalance),
          has_investments: formData.hasInvestments,
          has_assets: formData.hasAssets,
          financial_goal: formData.financialGoal,
          behavior_profile: formData.behaviorProfile
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error creating profile");
      }

      sessionStorage.removeItem("userId");
      navigate("/dashboard");
    } catch (catchError) {
      setError(catchError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Financial Profile</h1>
          <p className="auth-subtitle">
            A few questions to understand your financial situation
          </p>
        </div>

        {error && <Alert type="error" className="mb-6">{error}</Alert>}

        <form onSubmit={handleFormSubmit} className="auth-form">
          <Input
            id="monthlyIncome"
            label="Monthly Income ($)"
            type="number"
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            required
          />

          <Input
            id="initialBalance"
            label="Initial Balance ($)"
            type="number"
            name="initialBalance"
            value={formData.initialBalance}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            required
          />

          <div className="form-group">
            <label htmlFor="financialGoal" className="form-label">
              Financial Goal
            </label>
            <textarea
              id="financialGoal"
              name="financialGoal"
              value={formData.financialGoal}
              onChange={handleInputChange}
              placeholder="Describe your financial goal..."
              rows="3"
              required
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="behaviorProfile" className="form-label">
              What is your behavior profile?
            </label>
            <select
              id="behaviorProfile"
              name="behaviorProfile"
              value={formData.behaviorProfile}
              onChange={handleInputChange}
              required
              className="form-select"
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>

          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="hasInvestments"
                checked={formData.hasInvestments}
                onChange={handleInputChange}
              />
              I have investments
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="hasAssets"
                checked={formData.hasAssets}
                onChange={handleInputChange}
              />
              I have assets
            </label>
          </div>

          <Button type="primary" className="btn-full" disabled={isLoading}>
            {isLoading ? "Creating profile..." : "Create Profile"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

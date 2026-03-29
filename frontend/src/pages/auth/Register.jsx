import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import { validateRegisterForm } from "../../validators/authValidator";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import "../../styles/auth.css";
import "../../styles/forms.css";

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
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle input change - update form state and clear errors
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError("");
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

      navigate("/verify-otp", {
        state: {
          userId: data.userId,
          email: formData.email
        }
      });

    } catch (err) {
      setError(err.message || "Unexpected error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        {/* Step Indicator */}
        <div className="form-steps">
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
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">Join us and start managing your investments</p>
        </div>
        
        {error && (
          <Alert type="error">{error}</Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">Personal Information</h3>
            
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* Contact Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">Contact Information</h3>
            
            <Input
              label="CPF"
              type="text"
              name="cpf"
              placeholder="CPF (11 digits)"
              value={formData.cpf}
              onChange={handleInputChange}
              disabled={isLoading}
              maxLength="14"
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="Phone (11 digits)"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={isLoading}
              maxLength="15"
            />
          </div>

          {/* Security Section */}
          <div className="form-section">
            <h3 className="form-section-title">Security</h3>
            
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <Button
            type="primary"
            className="btn-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Continue to Verification"}
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login" className="auth-link">Sign in instead</a>
        </p>
      </Card>
    </div>
  );
}


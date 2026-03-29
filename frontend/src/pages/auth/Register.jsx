import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateRegisterForm } from "../../validators/authValidator";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import "../../styles/auth.css";
import "../../styles/forms.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
      const response = await fetch(`${API_URL}/auth/register-with-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf.replace(/\D/g, ""),
          phone: formData.phone.replace(/\D/g, ""),
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error registering");
      }

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
        <h2 className="auth-title">Criar Conta</h2>
        
        {error && (
          <Alert type="error" message={error} />
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="text"
            name="name"
            placeholder="Seu Nome"
            value={formData.name}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <Input
            type="email"
            name="email"
            placeholder="seuemail@example.com"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <Input
            type="text"
            name="cpf"
            placeholder="CPF (11 dígitos)"
            value={formData.cpf}
            onChange={handleInputChange}
            disabled={isLoading}
            maxLength="14"
          />

          <Input
            type="tel"
            name="phone"
            placeholder="Telefone (11 dígitos)"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={isLoading}
            maxLength="15"
          />

          <Input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Senha"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <Button
            type="submit"
            className="btn-full"
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>

        <p className="auth-footer">
          Já tem conta? <a href="/login">Faça login</a>
        </p>
      </Card>
    </div>
  );
}


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import "../../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await register(
        formData.name,
        formData.email,
        formData.cpf,
        formData.phone,
        formData.password
      );

      sessionStorage.setItem("userId", user.id);
      navigate("/financial-profile");
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
          <h1 className="auth-title">Sign Up</h1>
          <p className="auth-subtitle">Create your Invest.IA account</p>
        </div>

        {error && <Alert type="error" className="mb-6">{error}</Alert>}

        <form onSubmit={handleFormSubmit} className="auth-form">
          <Input
            id="name"
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your full name"
            autoComplete="name"
            required
            minLength="3"
          />

          <Input
            id="email"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            autoComplete="email"
            required
          />

          <Input
            id="cpf"
            label="CPF"
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
            placeholder="000.000.000-00"
            autoComplete="off"
            required
          />

          <Input
            id="phone"
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            minLength="6"
          />

          <Button type="primary" className="btn-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <a href="/login" className="auth-link">
            Sign In
          </a>
        </p>
      </Card>
    </div>
  );
}

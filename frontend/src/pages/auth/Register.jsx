import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import "../../styles/auth.css";
import "../../styles/forms.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Nome é obrigatório";
    if (!formData.email.trim()) return "Email é obrigatório";
    if (!formData.cpf.trim()) return "CPF é obrigatório";
    if (formData.cpf.replace(/\D/g, "").length !== 11) return "CPF deve ter 11 dígitos";
    if (!formData.phone.trim()) return "Telefone é obrigatório";
    if (!formData.password) return "Senha é obrigatória";
    if (formData.password.length < 6) return "Senha deve ter no mínimo 6 caracteres";
    if (formData.password !== formData.confirmPassword) return "Senhas não correspondem";
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateForm();
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
        throw new Error(data.message || "Erro ao registrar");
      }

      navigate("/verify-otp", {
        state: {
          userId: data.userId,
          email: formData.email
        }
      });

    } catch (err) {
      setError(err.message || "Erro ao registrar. Tente novamente.");
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


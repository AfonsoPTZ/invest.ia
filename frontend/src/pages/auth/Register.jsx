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
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: ""
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const usuario = await register(
        formData.nome,
        formData.email,
        formData.cpf,
        formData.telefone,
        formData.senha
      );

      sessionStorage.setItem("usuarioId", usuario.id);
      navigate("/financial-profile");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Cadastro</h1>
          <p className="auth-subtitle">Crie sua conta no Invest.IA</p>
        </div>

        {erro && <Alert type="error" className="mb-6">{erro}</Alert>}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            id="nome"
            label="Nome Completo"
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
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
            onChange={handleChange}
            placeholder="seu@email.com"
            autoComplete="email"
            required
          />

          <Input
            id="cpf"
            label="CPF"
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            autoComplete="off"
            required
          />

          <Input
            id="telefone"
            label="Telefone"
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            required
          />

          <Input
            id="senha"
            label="Senha"
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            minLength="6"
          />

          <Button type="primary" className="btn-full" disabled={carregando}>
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>

        <p className="auth-footer">
          Já tem conta?{" "}
          <a href="/login" className="auth-link">
            Faça login
          </a>
        </p>
      </Card>
    </div>
  );
}

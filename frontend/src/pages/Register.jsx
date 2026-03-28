import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "../style/css/Register.css";

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

      // Armazena ID do usuário para usar no próximo passo
      sessionStorage.setItem("usuarioId", usuario.id);

      // Redireciona para o formulário de perfil financeiro
      navigate("/financial-profile");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Cadastro</h1>

        {erro && <div className="erro-mensagem">{erro}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Nome Completo *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome completo"
              autoComplete="name"
              required
              minLength="3"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label>CPF *</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label>Telefone *</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(00) 99999-9999"
              autoComplete="tel"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha *</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Digite uma senha segura"
              autoComplete="new-password"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="btn-cadastro"
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="login-link">
          Já tem conta? <a href="/">Faça login</a>
        </p>
      </div>
    </div>
  );
}

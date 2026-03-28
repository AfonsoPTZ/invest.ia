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
    rendaMensal: "",
    saldoInicial: "",
    possuiInvestimentos: false,
    possuiPatrimonio: false,
    objetivoFinanceiro: "",
    perfilComportamento: "moderado"
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const usuarioId = sessionStorage.getItem("usuarioId");

  if (!usuarioId) {
    return (
      <div className="auth-container">
        <Card className="auth-card">
          <h2 className="auth-title">Erro</h2>
          <p className="auth-subtitle mb-6">
            Usuário não encontrado. Por favor, cadastre-se novamente.
          </p>
          <a href="/register">
            <Button type="primary" className="btn-full">
              Voltar ao cadastro
            </Button>
          </a>
        </Card>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/perfil-financeiro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          usuario_id: usuarioId,
          renda_mensal: parseFloat(formData.rendaMensal),
          saldo_inicial: parseFloat(formData.saldoInicial),
          possui_investimentos: formData.possuiInvestimentos,
          possui_patrimonio: formData.possuiPatrimonio,
          objetivo_financeiro: formData.objetivoFinanceiro,
          perfil_comportamento: formData.perfilComportamento
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensagem || "Erro ao criar perfil");
      }

      sessionStorage.removeItem("usuarioId");
      navigate("/dashboard");
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
          <h1 className="auth-title">Perfil Financeiro</h1>
          <p className="auth-subtitle">
            Algumas perguntas para conhecer melhor sua situação financeira
          </p>
        </div>

        {erro && <Alert type="error" className="mb-6">{erro}</Alert>}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            id="rendaMensal"
            label="Renda Mensal (R$)"
            type="number"
            name="rendaMensal"
            value={formData.rendaMensal}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            required
          />

          <Input
            id="saldoInicial"
            label="Saldo Inicial (R$)"
            type="number"
            name="saldoInicial"
            value={formData.saldoInicial}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            required
          />

          <div className="form-group">
            <label htmlFor="objetivoFinanceiro" className="form-label">
              Objetivo Financeiro
            </label>
            <textarea
              id="objetivoFinanceiro"
              name="objetivoFinanceiro"
              value={formData.objetivoFinanceiro}
              onChange={handleChange}
              placeholder="Descreva seu objetivo financeiro..."
              rows="3"
              required
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="perfilComportamento" className="form-label">
              Qual é seu perfil de comportamento?
            </label>
            <select
              id="perfilComportamento"
              name="perfilComportamento"
              value={formData.perfilComportamento}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="conservador">Conservador</option>
              <option value="moderado">Moderado</option>
              <option value="gastador">Gastador</option>
            </select>
          </div>

          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="possuiInvestimentos"
                checked={formData.possuiInvestimentos}
                onChange={handleChange}
              />
              Possuo investimentos
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="possuiPatrimonio"
                checked={formData.possuiPatrimonio}
                onChange={handleChange}
              />
              Possuo patrimônio
            </label>
          </div>

          <Button type="primary" className="btn-full" disabled={carregando}>
            {carregando ? "Criando perfil..." : "Criar perfil"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

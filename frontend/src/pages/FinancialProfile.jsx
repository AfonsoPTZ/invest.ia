import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/css/FinancialProfile.css";

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
      <div className="fp-container">
        <div className="fp-card">
          <h2>Erro</h2>
          <p>Usuário não encontrado. Por favor, cadastre-se novamente.</p>
          <a href="/register">Voltar ao cadastro</a>
        </div>
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

      // Limpa sessionStorage
      sessionStorage.removeItem("usuarioId");

      // Redireciona para dashboard
      navigate("/dashboard");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-card">
        <h1>Perfil Financeiro</h1>
        <p className="fp-subtitulo">
          Algumas perguntas para conhecer melhor sua situação financeira
        </p>

        {erro && <div className="erro-mensagem">{erro}</div>}

        <form onSubmit={handleSubmit} className="fp-form">
          <div className="form-group">
            <label>Renda Mensal (R$) *</label>
            <input
              type="number"
              name="rendaMensal"
              value={formData.rendaMensal}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Saldo Inicial (R$) *</label>
            <input
              type="number"
              name="saldoInicial"
              value={formData.saldoInicial}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Objetivo Financeiro *</label>
            <textarea
              name="objetivoFinanceiro"
              value={formData.objetivoFinanceiro}
              onChange={handleChange}
              placeholder="Descreva seu objetivo financeiro..."
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Qual é seu perfil de comportamento? *</label>
            <select
              name="perfilComportamento"
              value={formData.perfilComportamento}
              onChange={handleChange}
              required
            >
              <option value="conservador">Conservador</option>
              <option value="moderado">Moderado</option>
              <option value="gastador">Gastador</option>
            </select>
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="possuiInvestimentos"
                checked={formData.possuiInvestimentos}
                onChange={handleChange}
              />
              Você possui investimentos?
            </label>
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="possuiPatrimonio"
                checked={formData.possuiPatrimonio}
                onChange={handleChange}
              />
              Você possui patrimônio (bens)?
            </label>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="btn-continuar"
          >
            {carregando ? "Salvando..." : "Continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}

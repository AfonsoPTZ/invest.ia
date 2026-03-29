import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import logger from "../../utils/logger";
import "../../styles/auth.css";
import "../../styles/forms.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function FinancialProfile() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
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
    behavior_profile: "moderado"
  });

  // Validar token ao carregar página
  useEffect(() => {
    const tempToken = sessionStorage.getItem("tempProfileToken");

    if (!tempToken) {
      logger.warn({}, "FinancialProfile: Temporary token not found");
      setError("Token expirado ou não encontrado. Por favor, faça o registro novamente.");
      setTimeout(() => navigate("/register"), 3000);
      return;
    }

    logger.info({}, "FinancialProfile: Temporary token validated");
    setToken(tempToken);
  }, [navigate]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    setError("");
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (!token) {
        logger.warn({}, "FinancialProfile: Token not found for submission");
        throw new Error("Token não encontrado. Por favor, faça o registro novamente.");
      }

      logger.info({}, "FinancialProfile: Attempting to create financial profile");

      // Validar campos obrigatórios
      if (!formData.financial_goal) {
        throw new Error("Por favor, selecione um objetivo financeiro");
      }

      // Se marcou "tem renda mensal", validar renda
      if (formData.has_monthly_income && !formData.monthly_income) {
        throw new Error("Por favor, informe a renda mensal");
      }

      // Se marcou "tem patrimônio", validar saldo inicial
      if (formData.has_initial_balance && !formData.initial_balance) {
        throw new Error("Por favor, informe o saldo inicial");
      }

      logger.info({}, "FinancialProfile: Validation passed. Sending data...");

      const response = await fetch(`${API_URL}/perfil-financeiro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          monthly_income: formData.has_monthly_income ? parseFloat(formData.monthly_income) || 0 : 0,
          initial_balance: formData.has_initial_balance ? parseFloat(formData.initial_balance) || 0 : 0,
          has_investments: formData.has_investments,
          has_assets: formData.has_assets,
          financial_goal: formData.financial_goal,
          behavior_profile: formData.behavior_profile
        })
      });

      const data = await response.json();

      if (!response.ok) {
        logger.warn({}, `FinancialProfile: Failed to save profile - ${data.message}`);
        throw new Error(data.message || "Erro ao salvar perfil financeiro");
      }

      logger.info({}, "FinancialProfile: Profile saved successfully. Redirecting to login");

      setSuccess("Perfil financeiro salvo com sucesso! Redirecionando para login...");

      // Limpar sessionStorage
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
        <h2 className="auth-title">Perfil Financeiro</h2>
        
        <p className="auth-subtitle mb-6">
          Quase pronto! Complete seu perfil financeiro para começar a investir.
        </p>

        {error && (
          <Alert type="error" message={error} />
        )}

        {success && (
          <Alert type="success" message={success} />
        )}

        <form onSubmit={handleFormSubmit} className="auth-form">
          {/* Renda Mensal */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="has_monthly_income"
                checked={formData.has_monthly_income}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              Tenho renda mensal
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

          {/* Patrimônio / Saldo Inicial */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="has_initial_balance"
                checked={formData.has_initial_balance}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              Tenho patrimônio/saldo inicial
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

          {/* Tenho Investimentos */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="has_investments"
                checked={formData.has_investments}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              Tenho investimentos
            </label>
          </div>

          {/* Tenho Patrimônio/Bens */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="has_assets"
                checked={formData.has_assets}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              Tenho patrimônio/bens (imoveleia, veícula, etc)
            </label>
          </div>

          {/* Objetivo Financeiro */}
          <div className="form-group">
            <label htmlFor="financial_goal">Qual é seu objetivo financeiro? *</label>
            <select
              id="financial_goal"
              name="financial_goal"
              value={formData.financial_goal}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="form-select"
            >
              <option value="">Selecione um objetivo</option>
              <option value="accumulate_wealth">Acumular riqueza</option>
              <option value="retirement_planning">Planejamento de aposentadoria</option>
              <option value="education_funding">Financiar educação</option>
              <option value="home_purchase">Comprar casa</option>
              <option value="emergency_fund">Fundo de emergência</option>
              <option value="debt_reduction">Reduzir dívidas</option>
              <option value="short_term_savings">Poupança de curto prazo</option>
              <option value="wealth_transfer">Transferência de riqueza</option>
              <option value="business_expansion">Expansão do negócio</option>
              <option value="other">Outro</option>
            </select>
          </div>

          {/* Perfil de Comportamento */}
          <div className="form-group">
            <label htmlFor="behavior_profile">Qual é seu perfil de investidor? *</label>
            <select
              id="behavior_profile"
              name="behavior_profile"
              value={formData.behavior_profile}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="form-select"
            >
              <option value="conservador">Conservador (poucos riscos)</option>
              <option value="moderado">Moderado (risco médio)</option>
              <option value="agressivo">Agressivo (alto risco, alto retorno)</option>
            </select>
          </div>

          <Button
            type="submit"
            className="btn-full"
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Completar Cadastro"}
          </Button>
        </form>

        <p className="auth-footer">
          <a href="/register">Voltar ao cadastro</a>
        </p>
      </Card>
    </div>
  );
}

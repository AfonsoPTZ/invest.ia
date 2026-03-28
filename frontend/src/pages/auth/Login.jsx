import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert";
import Card from "../../components/Card";
import "../../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleFormSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login(email, password);
      navigate("/dashboard");
    } catch (catchError) {
      setError(catchError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Invest.IA</h1>
          <p className="auth-subtitle">Manage your investments</p>
        </div>

        <form onSubmit={handleFormSubmit} className="auth-form">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <Alert type="error">{error}</Alert>}

          <Button type="primary" className="btn-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <a href="/register" className="auth-link">
            Sign Up
          </a>
        </p>
      </Card>
    </div>
  );
}

export default Login;

import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Alert from "../../components/Alert";
import logger from "../../utils/logger";
import "../../styles/auth.css";
import "../../styles/forms.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const userId = location.state?.userId;
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const inputRefs = useRef([]);

  // Redirect if no userId/email
  useEffect(() => {
    if (!userId || !email) {
      navigate("/register");
    }
  }, [userId, email, navigate]);

  // Timer para reenvio
  useEffect(() => {
    if (resendTimer === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setResendTimer(resendTimer - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Por favor, digite todos os 6 dígitos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      logger.info({ userId }, "VerifyOtp: Attempting email verification");

      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, otpCode })
      });

      const data = await response.json();

      if (!response.ok) {
        logger.warn({ userId }, "VerifyOtp: Email verification failed");
        throw new Error(data.message || "Código inválido");
      }

      // Armazenar token temporário para completar perfil
      if (data.token) {
        sessionStorage.setItem("tempProfileToken", data.token);
        sessionStorage.setItem("userId", userId);

        logger.info({ userId }, "VerifyOtp: Temporary token stored. Redirecting to financial profile");
      }

      navigate("/financial-profile", { 
        replace: true,
        state: { 
          token: data.token,
          userId 
        }
      });

    } catch (err) {
      logger.error({ userId, error: err.message }, "VerifyOtp: Error on email verification");
      setError(err.message);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");

    try {
      logger.info({ userId }, "VerifyOtp: Attempting to resend OTP");

      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (!response.ok) {
        logger.warn({ userId }, "VerifyOtp: Resend OTP failed");
        throw new Error(data.message || "Erro ao reenviar");
      }

      logger.info({ userId }, "VerifyOtp: OTP resent successfully");

      setOtp(["", "", "", "", "", ""]);
      setCanResend(false);
      setResendTimer(30);
      inputRefs.current[0]?.focus();

    } catch (err) {
      logger.error({ userId, error: err.message }, "VerifyOtp: Error resending OTP");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <h2 className="auth-title">Verificar Email</h2>
        
        <p className="auth-subtitle mb-6">
          Enviamos um código para <strong>{email}</strong>
        </p>

        {error && (
          <Alert type="error" message={error} />
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="otp-input-group">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => inputRefs.current[index] = el}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className="otp-input"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <Button
            type="submit"
            className="btn-full"
            disabled={isLoading || otp.join("").length !== 6}
          >
            {isLoading ? "Verificando..." : "Verificar Código"}
          </Button>
        </form>

        <div className="otp-footer">
          <p>Não recebeu o código?</p>
          <Button
            type="button"
            className="btn-link"
            disabled={!canResend || isLoading}
            onClick={handleResendOtp}
          >
            {canResend ? "Reenviar Código" : `Reenviar em ${resendTimer}s`}
          </Button>
        </div>

        <p className="auth-footer">
          <a href="/register">Voltar ao cadastro</a>
        </p>
      </Card>
    </div>
  );
}
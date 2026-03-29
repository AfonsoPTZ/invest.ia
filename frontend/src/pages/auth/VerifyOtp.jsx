import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail, resendOtp } from "../../services/authService";
import { validateOTPCode } from "../../validators/authValidator";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Alert from "../../components/Alert";
import logger from "../../utils/logger";
import "../../styles/auth.css";
import "../../styles/forms.css";

/**
 * Email OTP Verification Page
 * 
 * User enters 6-digit OTP code sent to their email during registration
 * Frontend validation: code length (6 digits)
 * Backend validation: OTP matches registered email, hasn't expired
 * 
 * Flow:
 * 1. User receives OTP email after /auth/register-with-otp
 * 2. User enters 6-digit code
 * 3. Calls /auth/verify-email with userId and otpCode
 * 4. Backend validates OTP and returns temporary token
 * 5. Token stored in sessionStorage for next page
 * 6. Redirects to /financial-profile to complete registration
 * 
 * @component
 */
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

  /**
   * Redirect to register if no userId/email passed from previous page
   */
  useEffect(() => {
    if (!userId || !email) {
      navigate("/register");
    }
  }, [userId, email, navigate]);

  /**
   * Countdown timer for resend button
   * When timer reaches 0, enable resend button
   */
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

  /**
   * Handle individual OTP digit input
   * Only allows digits, auto-focus to next input
   */
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle backspace to focus previous input
   */
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /**
   * Submit OTP code for verification
   * Validates code locally, then sends to backend
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const otpCode = otp.join("");

    // Frontend validation - ensure all 6 digits entered
    const validationError = validateOTPCode(otpCode);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      logger.info({ userId }, "VerifyOtp: Attempting email verification");

      const data = await verifyEmail(userId, otpCode);

      // Store temporary token and userId for next page
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

  /**
   * Resend OTP code to registered email
   * Implements 30-second cooldown
   */
  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");

    try {
      logger.info({ userId }, "VerifyOtp: Attempting to resend OTP");

      const data = await resendOtp(userId);

      logger.info({ userId }, "VerifyOtp: OTP resent successfully");

      // Reset form and timer
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
          <Alert type="error">{error}</Alert>
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
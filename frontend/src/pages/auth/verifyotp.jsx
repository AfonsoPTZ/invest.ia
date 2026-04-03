import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "motion/react";
import { toast } from "sonner";
import { verifyEmail, resendOtp } from "../../services/authService";
import { validateOTPCode } from "../../validators/authValidator";
import { useAnimateOnMount } from "../../utils/useAnimations";
import Button from "../../components/button";
import Card from "../../components/card";
import Alert from "../../components/alert";
import PageTransition from "../../components/pagetransition";
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const inputRefs = useRef([]);
  const cardRef = useAnimateOnMount('animate-scale-in', 100);

  /**
   * Redirect to register if no userId/email passed from previous page
   */
  useEffect(() => {
    if (!userId || !email) {
      navigate("/register");
    }
  }, [userId, email, navigate]);

  /**
   * Map error message to field names
   */
  const mapErrorToFields = (errorMessage) => {
    const errorMap = {
      'OTP code is required': 'otp',
      'OTP code must be 6 digits': 'otp'
    };
    return errorMap[errorMessage] || null;
  };

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
    setFieldErrors(prev => ({ ...prev, otp: "" }));

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
      const fieldName = mapErrorToFields(validationError);
      if (fieldName) {
        setFieldErrors(prev => ({
          ...prev,
          [fieldName]: validationError
        }));
      }
      return;
    }

    setIsLoading(true);
    setError("");
    setFieldErrors({});

    try {
      logger.info({ userId }, "VerifyOtp: Attempting email verification");

      const data = await verifyEmail(userId, otpCode);

      // Store temporary token and userId for next page
      if (data.token) {
        sessionStorage.setItem("tempProfileToken", data.token);
        sessionStorage.setItem("userId", userId);

        logger.info({ userId }, "VerifyOtp: Temporary token stored. Redirecting to financial profile");
      }

      // Show success message
      setSuccess("Email verified successfully! Redirecting to profile...");
      setError("");

      setTimeout(() => {
        navigate("/financial-profile", { 
          replace: true,
          state: { 
            token: data.token,
            userId 
          }
        });
      }, 1500);

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
    <PageTransition>
      <div className="auth-container">
        {/* Panda Mascot */}
        <motion.div 
          className="auth-panda-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.25 }}
        >
          <img 
            src="/panda-login-top.png" 
            alt="Invest_IA Mascot"
            className="auth-panda-image"
            onError={(e) => e.target.style.display = 'none'}
          />
        </motion.div>

        <Card className="auth-card" ref={cardRef}>
          {/* Step Indicator */}
          <motion.div 
            className="form-steps"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="step-item completed">
              <div className="step-number"><FaCheckCircle size={20} /></div>
              <div className="step-label">Register</div>
            </div>
            <div className="step-connector completed"></div>
            <div className="step-item active">
              <div className="step-number">2</div>
              <div className="step-label">Verify</div>
            </div>
            <div className="step-connector"></div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-label">Profile</div>
            </div>
          </motion.div>

          <motion.div 
            className="auth-header"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="auth-title">Verify Your Email</h1>
            <p className="auth-subtitle">
              We've sent a verification code to <strong>{email}</strong>
            </p>
          </motion.div>

          {error && (
            <Alert type="error">{error}</Alert>
          )}

          {success && (
            <Alert type="success">{success}</Alert>
          )}

          <motion.form 
            onSubmit={handleSubmit} 
            className="auth-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div 
              className="otp-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="form-label">Enter Verification Code</label>
              <div className={`otp-input-group ${fieldErrors.otp ? 'has-error' : ''}`}>
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => inputRefs.current[index] = el}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLoading}
                    className={`otp-input ${fieldErrors.otp ? 'has-error' : ''}`}
                    autoFocus={index === 0}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.55 + index * 0.05 }}
                    whileFocus={{ scale: 1.1 }}
                  />
                ))}
              </div>
              <p className="otp-help-text">Enter the 6-digit code from your email</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="primary"
                className="btn-full"
                disabled={isLoading || otp.join("").length !== 6}
                isLoading={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div 
            className="otp-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p>Didn't receive the code?</p>
            <Button
              type="button"
              className="btn-link"
              disabled={!canResend || isLoading}
              onClick={handleResendOtp}
            >
              {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
            </Button>
          </motion.div>

          <motion.p 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <a href="/register" className="auth-link">Back to Registration</a>
          </motion.p>
        </Card>
      </div>
    </PageTransition>
  );
}
import React, { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "motion/react";
import { toast } from "sonner";
import { verifyEmail, resendOtp } from "../../services/authService";
import { validateOTPCode } from "../../validators/authValidator";
import { useAnimateOnMount } from "../../utils/useAnimations";
import { useFormState } from "../../utils/useFormState";
import type { FieldErrorMap } from "../../types/api";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Alert from "../../components/Alert";
import PageTransition from "../../components/PageTransition";
import logger from "../../utils/logger";
import "../../styles/auth.css";
import "../../styles/forms.css";

/**
 * Email OTP Verification Page (TypeScript)
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
function VerifyOtp(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  
  const userId = location.state?.userId as string | number;
  const email = location.state?.email as string;

  // Form state management (centralized hook)
  const { 
    error, 
    setError, 
    success, 
    setSuccess, 
    fieldErrors, 
    setFieldErrors, 
    isLoading, 
    setIsLoading 
  } = useFormState();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
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
   * @param errorMessage - Error message from validation
   * @returns Field name or null
   */
  const mapErrorToFields = (errorMessage: string): keyof FieldErrorMap | null => {
    const errorMap: Record<string, keyof FieldErrorMap> = {
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
   * @param index - Position in OTP array
   * @param value - Input value
   */
  const handleOtpChange = (index: number, value: string): void => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    setFieldErrors({ ...fieldErrors, otp: "" });

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /**
   * Handle backspace to focus previous input
   * @param index - Position in OTP array
   * @param e - Keyboard event
   */
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /**
   * Submit OTP code for verification
   * Validates code locally, then sends to backend
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const otpCode = otp.join("");

    // Frontend validation - ensure all 6 digits entered
    const validationError = validateOTPCode(otpCode);
    if (validationError) {
      setError(validationError);
      const fieldName = mapErrorToFields(validationError);
      if (fieldName) {
        setFieldErrors({ ...fieldErrors, [fieldName]: validationError });
      }
      return;
    }

    setIsLoading(true);
    setError("");
    setFieldErrors({});

    try {
      logger.info({ userId }, "VerifyOtp: Attempting email verification");

      const data = await verifyEmail(userId, otpCode);

      // Store userId for reference (token already stored by authService)
      sessionStorage.setItem("userId", userId as string);

      logger.info({ userId }, "VerifyOtp: Email verified. Token stored. Redirecting to financial profile");

      // Show success message
      setSuccess("Email verified successfully! Redirecting to profile...");
      setError("");

      setTimeout(() => {
        navigate("/financial-profile", { 
          replace: true,
          state: { 
            token: data.tempProfileToken,
            userId 
          }
        });
      }, 1500);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      logger.error({ userId, error: errorMsg }, "VerifyOtp: Error on email verification");
      setError(errorMsg);
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
  const handleResendOtp = async (): Promise<void> => {
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
      const errorMsg = err instanceof Error ? err.message : "Failed to resend OTP";
      logger.error({ userId, error: errorMsg }, "VerifyOtp: Error resending OTP");
      setError(errorMsg);
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
            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
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
            <Alert type="error" onClose={() => setError("")}>{error}</Alert>
          )}

          {success && (
            <Alert type="success" onClose={() => setSuccess("")}>{success}</Alert>
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
                    ref={(el) => {
                      if (el !== null) inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
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
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  if (isLoading) e.preventDefault();
                }}
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

export default VerifyOtp;
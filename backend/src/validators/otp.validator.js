/**
 * Validar formato e comprimento do OTP
 */
function validateOtpFormat(otp) {
  try {
    if (!otp || typeof otp !== "string") {
      return {
        isValid: false,
        error: "OTP deve ser uma string"
      };
    }

    // Remove any non-digit characters (spaces, dashes, etc)
    const cleanedOtp = String(otp).replace(/\D/g, "");

    if (cleanedOtp.length !== 6) {
      return {
        isValid: false,
        error: "OTP deve conter 6 dígitos"
      };
    }

    return {
      isValid: true,
      cleanedOtp
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
}

module.exports = { validateOtpFormat };

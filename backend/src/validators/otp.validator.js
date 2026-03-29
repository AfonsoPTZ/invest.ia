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

    if (!/^\d{6}$/.test(otp)) {
      return {
        isValid: false,
        error: "OTP deve conter 6 dígitos"
      };
    }

    return {
      isValid: true,
      cleanedOtp: otp
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
}

module.exports = { validateOtpFormat };

/**
 * Validar formato e comprimento do OTP
 */
function validateOtpFormat(otp: any): any {
  try {
    if (!otp || typeof otp !== "string") {
      return {
        isValid: false,
        error: "OTP deve ser uma string"
      };
    }

    // Remove any non-digit characters (spaces, dashes, etc)
    const cleanedOtp: string = String(otp).replace(/\D/g, "");

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
    const errorMessage: string = error instanceof Error ? error.message : String(error);
    return {
      isValid: false,
      error: errorMessage
    };
  }
}

export { validateOtpFormat };

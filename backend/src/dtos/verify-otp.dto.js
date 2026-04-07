/**
 * VerifyOtpDTO - Data Transfer Object para verificação de OTP
 * Transporta userId e otpCode de forma tipada
 */
class VerifyOtpDTO {
  constructor(userId, otpCode) {
    this.userId = userId;
    this.otpCode = otpCode;
  }

  /**
   * Factory method: criar DTO a partir do request body
   */
  static fromRequest(body) {
    const { userId, otpCode } = body;
    return new VerifyOtpDTO(userId, otpCode);
  }

  /**
   * Retornar dados para serialização/log
   */
  toJSON() {
    return {
      userId: this.userId,
      otpCode: this.otpCode
    };
  }
}

export default VerifyOtpDTO;

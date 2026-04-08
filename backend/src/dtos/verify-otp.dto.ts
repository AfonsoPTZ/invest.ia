/**
 * VerifyOtpDTO - Data Transfer Object para verificação de OTP
 * Transporta userId e otpCode de forma tipada
 */

interface IVerifyOtpRequest {
  userId?: string | number;
  otpCode?: string;
}

class VerifyOtpDTO {
  userId: string | number;
  otpCode: string;

  constructor(userId: string | number, otpCode: string) {
    this.userId = userId;
    this.otpCode = otpCode;
  }

  /**
   * Factory method: criar DTO a partir do request body
   */
  static fromRequest(body: IVerifyOtpRequest): VerifyOtpDTO {
    const { userId = "", otpCode = "" } = body;
    return new VerifyOtpDTO(userId, otpCode);
  }

  /**
   * Retornar dados para serialização/log
   */
  toJSON(): object {
    return {
      userId: this.userId,
      otpCode: this.otpCode
    };
  }
}

export default VerifyOtpDTO;
export type { IVerifyOtpRequest };

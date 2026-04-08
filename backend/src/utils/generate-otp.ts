/**
 * Gera um código OTP aleatório
 * @param length - Comprimento do código (padrão: 6)
 * @returns Código OTP aleatório
 */
export function generateOtp(length: number = 6): string {
  let otp: string = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

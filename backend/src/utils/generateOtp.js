/**
 * Gera um código OTP aleatório
 * @param {number} length - Comprimento do código (padrão: 6)
 * @returns {string} Código OTP aleatório
 */
function generateOtp(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

module.exports = { generateOtp };

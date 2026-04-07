// Email Service - Gerencia envio de emails
import nodemailer from "nodemailer";
import logger from "../../utils/logger.js";

/**
 * Configuração do transporter de email
 * Usar variáveis de ambiente para produção
 */
// Validar credenciais SMTP obrigatórias
if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error("Email configuration incomplete: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASSWORD are required in .env");
}

const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Enviar email com OTP
 * @param {string} email - Email do destinatário
 * @param {string} otp - Código OTP gerado
 * @returns {Promise<boolean>} true se enviado com sucesso
 */
async function sendOtpEmail(email, otp) {
  try {
    logger.info({ email }, "EmailService: Sending OTP email");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verificação de Email - Invest_IA",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Bem-vindo ao Invest_IA!</h2>
          
          <p>Use este código para verificar seu email:</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2563eb; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          
          <p style="color: #666;">
            <strong>⏱️ Este código expira em 5 minutos</strong>
          </p>
          
          <p style="color: #666;">
            Se você não solicitou este código, ignore este email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            Invest_IA - Seu assistente financeiro inteligente
          </p>
        </div>
      `
    };

    const info = await emailTransporter.sendMail(mailOptions);
    logger.info({ email, messageId: info.messageId }, "EmailService: OTP email sent successfully");
    return true;

  } catch (error) {
    logger.error({ error: error.message, email }, "EmailService: Error sending OTP email");
    throw new Error(`Erro ao enviar email: ${error.message}`);
  }
}

/**
 * Enviar email de verificação completa
 * @param {string} email - Email do usuário
 * @param {string} userName - Nome do usuário
 * @returns {Promise<boolean>} true se enviado com sucesso
 */
async function sendVerificationSuccessEmail(email, userName) {
  try {
    logger.info({ email }, "EmailService: Sending verification success email");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verificado - Invest_IA",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verificado com Sucesso!</h2>
          
          <p>Olá <strong>${userName}</strong>,</p>
          
          <p>Seu email foi verificado com sucesso! 🎉</p>
          
          <p>Agora você pode acessar a plataforma e começar a gerenciar suas finanças.</p>
          
          <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0;">
            Acessar Invest_IA
          </a>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            Invest_IA - Seu assistente financeiro inteligente
          </p>
        </div>
      `
    };

    await emailTransporter.sendMail(mailOptions);
    logger.info({ email }, "EmailService: Verification success email sent");
    return true;

  } catch (error) {
    logger.error({ error: error.message, email }, "EmailService: Error sending verification email");
    throw new Error(`Erro ao enviar email de verificação: ${error.message}`);
  }
}

class EmailService {
  async sendOtpEmail(email, otp) {
    return sendOtpEmail(email, otp);
  }

  async sendVerificationSuccessEmail(email, userName) {
    return sendVerificationSuccessEmail(email, userName);
  }
}

export default new EmailService();

// Register Service - Cadastro de usuário
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepository = require("../../repositories/userRepository");
const userValidator = require("../../validators/userValidator");
const { sendVerificationCode } = require("./emailVerification.service");
const logger = require("../../utils/logger");

const HASH_ROUNDS = 10;

/**
 * Registrar novo usuário e enviar código de verificação
 * @param {string} name - Nome do usuário
 * @param {string} email - Email do usuário
 * @param {string} cpf - CPF do usuário
 * @param {string} phone - Telefone do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<{userId: number, message: string}>}
 */
async function registerUser(name, email, cpf, phone, password) {
  try {
    logger.info({ email, cpf }, "RegisterService: Starting user registration");

    // Step 1: Validar entrada
    const validation = userValidator.validateUserRegistration(
      name,
      email,
      cpf,
      phone,
      password
    );

    if (!validation.isValid) {
      logger.warn({ email, errors: validation.errors }, "RegisterService: Validation failed");
      throw new Error(validation.errors.join(", "));
    }

    const {
      name: cleanName,
      email: cleanEmail,
      cpf: cleanCpf,
      phone: cleanPhone
    } = validation.cleanedData;

    // Step 2: Verificar duplicatas
    if (await authRepository.emailExists(cleanEmail)) {
      logger.warn({ email: cleanEmail }, "RegisterService: Email already registered");
      throw new Error("Email já registrado");
    }

    if (await authRepository.cpfExists(cleanCpf)) {
      logger.warn({ cpf: cleanCpf }, "RegisterService: CPF already registered");
      throw new Error("CPF já registrado");
    }

    if (await authRepository.phoneExists(cleanPhone)) {
      logger.warn({ phone: cleanPhone }, "RegisterService: Phone already registered");
      throw new Error("Telefone já registrado");
    }

    // Step 3: Hash de senha e criar usuário
    const passwordHash = await bcrypt.hash(password, HASH_ROUNDS);
    const newUser = await authRepository.create({
      name: cleanName,
      email: cleanEmail,
      cpf: cleanCpf,
      phone: cleanPhone,
      passwordHash
    });

    logger.info({ userId: newUser.id, email: cleanEmail }, "RegisterService: User created");

    // Step 4: Enviar código de verificação
    try {
      await sendVerificationCode(newUser.id, cleanEmail);
      logger.info({ userId: newUser.id }, "RegisterService: Verification code sent");
    } catch (emailError) {
      logger.error({ error: emailError.message, userId: newUser.id }, "RegisterService: Error sending verification code");
      // Não falhar o registro se o email falhar, apenas log
    }

    return {
      userId: newUser.id,
      message: "Usuário registrado com sucesso! Verifique seu email para confirmar."
    };

  } catch (error) {
    logger.error({ error: error.message, email }, "RegisterService: Error during registration");
    throw new Error(error.message);
  }
}

module.exports = {
  registerUser
};

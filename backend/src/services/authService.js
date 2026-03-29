// Authentication Service - Doorkeeper pattern
// Orchestrates: Validators → Repositories
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository");
const userValidator = require("../validators/userValidator");
const logger = require("../utils/logger");

const HASH_ROUNDS = 10;

async function registerUser(name, email, cpf, phone, password) {
  try {
    logger.info({ email, cpf }, "Service: Starting user registration");

    // Step 1: Validate all inputs (validators do the heavy lifting)
    const validation = userValidator.validateUserRegistration(
      name,
      email,
      cpf,
      phone,
      password
    );

    if (!validation.isValid) {
      logger.warn({ email, errors: validation.errors }, "Service: Validation failed for registration");
      throw new Error(validation.errors.join(", "));
    }

    // Extract cleaned data from validator
    const {
      name: cleanName,
      email: cleanEmail,
      cpf: cleanCPF,
      phone: cleanPhone
    } = validation.cleanedData;

    // Step 2: Check for duplicates in repository
    if (await authRepository.emailExists(cleanEmail)) {
      logger.warn({ email: cleanEmail }, "Service: Email already registered");
      throw new Error("Email already registered");
    }

    if (await authRepository.cpfExists(cleanCPF)) {
      logger.warn({ cpf: cleanCPF }, "Service: CPF already registered");
      throw new Error("CPF already registered");
    }

    if (await authRepository.phoneExists(cleanPhone)) {
      logger.warn({ phone: cleanPhone }, "Service: Phone already registered");
      throw new Error("Phone already registered");
    }

    // Step 3: Hash password and create user via repository
    const passwordHash = await bcrypt.hash(password, HASH_ROUNDS);
    const newUser = await authRepository.create({
      name: cleanName,
      email: cleanEmail,
      cpf: cleanCPF,
      phone: cleanPhone,
      passwordHash
    });

    // Step 4: Generate authentication token
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const generatedToken = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      jwtSecret,
      { expiresIn: "7d" }
    );

    logger.info({ userId: newUser.id, email: newUser.email }, "Service: User registered successfully");

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token: generatedToken
    };

  } catch (error) {
    logger.error({ error: error.message, email }, "Service: Error during user registration");
    throw new Error(error.message);
  }
}

async function login(email, password) {
  try {
    logger.info({ email }, "Service: Starting user login");

    // Step 1: Validate inputs
    const emailValidation = userValidator.validateEmail(email);
    if (!emailValidation.isValid) {
      logger.warn({ email }, "Service: Invalid email format");
      throw new Error("Invalid email format");
    }

    const passwordValidation = userValidator.validatePassword(password);
    if (!passwordValidation.isValid) {
      logger.warn({ email }, "Service: Invalid password format");
      throw new Error("Invalid password");
    }

    // Step 2: Find user in repository
    const foundUser = await authRepository.findByEmail(emailValidation.cleanedEmail);
    if (!foundUser) {
      logger.warn({ email: emailValidation.cleanedEmail }, "Service: User not found");
      throw new Error("Invalid email or password");
    }

    // Step 3: Verify password
    const validPassword = await bcrypt.compare(password, foundUser.passwordHash);
    if (!validPassword) {
      logger.warn({ userId: foundUser.id, email }, "Service: Invalid password");
      throw new Error("Invalid email or password");
    }

    // Step 4: Generate authentication token
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const generatedToken = jwt.sign(
      {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    logger.info({ userId: foundUser.id, email }, "Service: User logged in successfully");

    return {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      cpf: foundUser.cpf,
      token: generatedToken
    };

  } catch (error) {
    logger.error({ error: error.message, email }, "Service: Error during user login");
    throw new Error(error.message);
  }
}

async function getUserData(userId) {
  try {
    logger.debug({ userId }, "Service: Fetching user data");

    const user = await authRepository.findById(userId);
    if (!user) {
      logger.warn({ userId }, "Service: User not found");
      throw new Error("User not found");
    }

    logger.debug({ userId }, "Service: User data fetched successfully");
    return user;
  } catch (error) {
    logger.error({ error: error.message, userId }, "Service: Error fetching user data");
    throw new Error(error.message);
  }
}

async function changePassword(userId, currentPassword, newPassword) {
  try {
    logger.info({ userId }, "Service: Starting password change");

    // Step 1: Validate passwords via validators
    const currentPasswordValidation = userValidator.validatePassword(currentPassword);
    if (!currentPasswordValidation.isValid) {
      logger.warn({ userId }, "Service: Current password validation failed");
      throw new Error("Current password is invalid");
    }

    const newPasswordValidation = userValidator.validatePassword(newPassword);
    if (!newPasswordValidation.isValid) {
      logger.warn({ userId }, "Service: New password validation failed");
      throw new Error("New password " + newPasswordValidation.error);
    }

    // Step 2: Fetch user from repository
    const user = await authRepository.findById(userId);
    if (!user) {
      logger.warn({ userId }, "Service: User not found for password change");
      throw new Error("User not found");
    }

    // Step 3: Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!validPassword) {
      logger.warn({ userId }, "Service: Current password is incorrect");
      throw new Error("Current password is incorrect");
    }

    // Step 4: Hash new password and update via repository
    const newPasswordHash = await bcrypt.hash(newPassword, HASH_ROUNDS);
    const updated = await authRepository.updatePassword(userId, newPasswordHash);

    if (!updated) {
      logger.error({ userId }, "Service: Error updating password");
      throw new Error("Error updating password");
    }

    logger.info({ userId }, "Service: Password changed successfully");

    return { message: "Password updated successfully" };

  } catch (error) {
    logger.error({ error: error.message, userId }, "Service: Error during password change");
    throw new Error(error.message);
  }
}

module.exports = {
  registerUser,
  login,
  getUserData,
  changePassword
};
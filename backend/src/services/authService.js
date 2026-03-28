// Authentication Service - Doorkeeper pattern
// Orchestrates: Validators → Repositories
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository");
const userValidator = require("../validators/userValidator");

const HASH_ROUNDS = 10;

async function registerUser(name, email, cpf, phone, password) {
  try {
    // Step 1: Validate all inputs (validators do the heavy lifting)
    const validation = userValidator.validateUserRegistration(
      name,
      email,
      cpf,
      phone,
      password
    );

    if (!validation.isValid) {
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
      throw new Error("Email already registered");
    }

    if (await authRepository.cpfExists(cleanCPF)) {
      throw new Error("CPF already registered");
    }

    if (await authRepository.phoneExists(cleanPhone)) {
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

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token: generatedToken
    };

  } catch (error) {
    throw new Error(error.message);
  }
}

async function login(email, password) {
  try {
    // Step 1: Validate inputs
    const emailValidation = userValidator.validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error("Invalid email format");
    }

    const passwordValidation = userValidator.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error("Invalid password");
    }

    // Step 2: Find user in repository
    const foundUser = await authRepository.findByEmail(emailValidation.cleanedEmail);
    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    // Step 3: Verify password
    const validPassword = await bcrypt.compare(password, foundUser.passwordHash);
    if (!validPassword) {
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

    return {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      cpf: foundUser.cpf,
      token: generatedToken
    };

  } catch (error) {
    throw new Error(error.message);
  }
}

async function getUserData(userId) {
  try {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function changePassword(userId, currentPassword, newPassword) {
  try {
    // Step 1: Validate passwords via validators
    const currentPasswordValidation = userValidator.validatePassword(currentPassword);
    if (!currentPasswordValidation.isValid) {
      throw new Error("Current password is invalid");
    }

    const newPasswordValidation = userValidator.validatePassword(newPassword);
    if (!newPasswordValidation.isValid) {
      throw new Error("New password " + newPasswordValidation.error);
    }

    // Step 2: Fetch user from repository
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Step 3: Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!validPassword) {
      throw new Error("Current password is incorrect");
    }

    // Step 4: Hash new password and update via repository
    const newPasswordHash = await bcrypt.hash(newPassword, HASH_ROUNDS);
    const updated = await authRepository.updatePassword(userId, newPasswordHash);

    if (!updated) {
      throw new Error("Error updating password");
    }

    return { message: "Password updated successfully" };

  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  registerUser,
  login,
  getUserData,
  changePassword
};
// Authentication Controller - Simple request/response handler
const authService = require("../services/authService");
const logger = require("../utils/logger");

async function registerController(request, response) {
  try {
    const { name, email, cpf, phone, password } = request.body;

    logger.info({ email }, "Attempting user registration");

    // Service handles all validation
    const registerResult = await authService.registerUser(name, email, cpf, phone, password);

    logger.info({ userId: registerResult.id, email }, "User registered successfully");

    return response.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: {
        id: registerResult.id,
        name: registerResult.name,
        email: registerResult.email
      },
      token: registerResult.token
    });

  } catch (error) {
    logger.error({ error: error.message, email: request.body.email }, "Error on user registration");
    return response.status(400).json({
      status: "error",
      message: error.message
    });
  }
}

async function loginController(request, response) {
  try {
    const { email, password } = request.body;

    logger.info({ email }, "Attempting user login");

    // Service handles all validation
    const loginResult = await authService.login(email, password);

    logger.info({ userId: loginResult.id, email }, "User logged in successfully");

    return response.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        id: loginResult.id,
        name: loginResult.name,
        email: loginResult.email
      },
      token: loginResult.token
    });

  } catch (error) {
    logger.error({ error: error.message, email: request.body.email }, "Error on user login");
    return response.status(401).json({
      status: "error",
      message: error.message
    });
  }
}

async function logoutController(request, response) {
  try {
    const userId = request.user?.id;
    
    logger.info({ userId }, "User attempting logout");

    // JWT logout is done by removing token on frontend
    logger.info({ userId }, "User logged out successfully");

    return response.status(200).json({
      status: "success",
      message: "Logout successful"
    });
  } catch (error) {
    logger.error({ error: error.message }, "Error on user logout");
    return response.status(500).json({
      status: "error",
      message: error.message
    });
  }
}

async function getMeController(request, response) {
  try {
    const userId = request.user?.id;

    logger.info({ userId }, "Fetching authenticated user data");

    // User data extracted by authMiddleware
    return response.status(200).json({
      status: "success",
      user: request.user
    });
  } catch (error) {
    logger.error({ error: error.message, userId: request.user?.id }, "Error fetching authenticated user");
    return response.status(500).json({
      status: "error",
      message: error.message
    });
  }
}

module.exports = {
  registerController,
  loginController,
  logoutController,
  getMeController
};
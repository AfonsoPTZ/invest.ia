// Authentication Controller - Simple request/response handler
const authService = require("../services/authService");

async function registerController(request, response) {
  try {
    const { name, email, cpf, phone, password } = request.body;

    // Service handles all validation
    const registerResult = await authService.registerUser(name, email, cpf, phone, password);

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
    console.error("Error on user registration:", error.message);
    return response.status(400).json({
      status: "error",
      message: error.message
    });
  }
}

async function loginController(request, response) {
  try {
    const { email, password } = request.body;

    // Service handles all validation
    const loginResult = await authService.login(email, password);

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
    console.error("Error on user login:", error.message);
    return response.status(401).json({
      status: "error",
      message: error.message
    });
  }
}

async function logoutController(request, response) {
  try {
    // JWT logout is done by removing token on frontend
    return response.status(200).json({
      status: "success",
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Error on user logout:", error.message);
    return response.status(500).json({
      status: "error",
      message: error.message
    });
  }
}

async function getMeController(request, response) {
  try {
    // User data extracted by authMiddleware
    return response.status(200).json({
      status: "success",
      user: request.user
    });
  } catch (error) {
    console.error("Error fetching authenticated user:", error.message);
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
// JWT Authentication Middleware
const jwt = require("jsonwebtoken");

function authMiddleware(request, response, next) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    return response.status(401).json({
      status: "error",
      message: "Token not provided"
    });
  }

  const headerParts = authorizationHeader.split(" ");
  const token = headerParts[1];

  if (!token) {
    return response.status(401).json({
      status: "error",
      message: "Invalid or malformed token"
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    const decodedData = jwt.verify(token, jwtSecret);

    request.user = {
      id: decodedData.id,
      email: decodedData.email,
      name: decodedData.name
    };

    next();

  } catch (error) {
    return response.status(401).json({
      status: "error",
      message: "Token expired or invalid"
    });
  }
}

module.exports = authMiddleware;
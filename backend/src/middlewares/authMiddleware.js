// backend/src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

/**
 * Middleware para verificar se usuário está autenticado via JWT
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: "erro",
      mensagem: "Token não enviado"
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({
      status: "erro",
      mensagem: "Token inválido"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "sua-chave-secreta");
    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      nome: decoded.nome
    };
    next();
  } catch (error) {
    return res.status(401).json({
      status: "erro",
      mensagem: "Token expirado ou inválido"
    });
  }
}

module.exports = authMiddleware;
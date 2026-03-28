const express = require("express");
const router = express.Router();

const perfilFinanceiroController = require("../controllers/perfilFinanceiroController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * Rotas de perfil financeiro
 */

// Rotas públicas (durante o cadastro)
router.post("/", perfilFinanceiroController.create);

// Rotas protegidas
router.get("/:usuarioId", authMiddleware, perfilFinanceiroController.get);

module.exports = router;

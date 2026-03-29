const express = require("express");
const router = express.Router();

const perfilFinanceiroController = require("../controllers/perfilFinanceiroController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * Rotas de perfil financeiro
 */

// POST - Criar perfil (autenticado: durante o cadastro ou atualização)
router.post("/", authMiddleware, perfilFinanceiroController.create);

// GET - Obter perfil (autenticado)
router.get("/:usuarioId", authMiddleware, perfilFinanceiroController.get);

module.exports = router;

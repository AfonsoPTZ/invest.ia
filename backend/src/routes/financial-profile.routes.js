const express = require("express");
const router = express.Router();

const financialProfileController = require("../controllers/financial-profile.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validatorMiddleware = require("../middlewares/validator.middleware");
const financialProfileValidator = require("../validators/financial-profile.validator");

/**
 * Rotas de perfil financeiro
 * POST - Criar ou atualizar perfil financeiro
 * GET - Obter perfil financeiro por usuário
 */

// Validator wrapper for financial profile creation
const validateFinancialProfileCreation = (data) => {
  return financialProfileValidator.validateFinancialProfileRegistration(
    data.monthly_income,
    data.initial_balance,
    data.has_investments,
    data.has_assets,
    data.financial_goal,
    data.behavior_profile
  );
};

// POST - Criar perfil (autenticado: durante o cadastro ou atualização)
router.post(
  "/", 
  authMiddleware,
  validatorMiddleware(validateFinancialProfileCreation, "Financial Profile"),
  financialProfileController.create
);

// GET - Obter perfil (autenticado)
router.get(
  "/:usuarioId", 
  authMiddleware,
  financialProfileController.get
);

module.exports = router;

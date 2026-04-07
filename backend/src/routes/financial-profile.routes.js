import express from "express";
const router = express.Router();

import financialProfileController from "../controllers/financial-profile.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validatorMiddleware from "../middlewares/validator.middleware.js";
import { validateFinancialProfileRegistration } from "../validators/financial-profile.validator.js";

/**
 * Rotas de perfil financeiro
 * POST - Criar ou atualizar perfil financeiro
 * GET - Obter perfil financeiro por usuário
 */

// Validator wrapper for financial profile creation
const validateFinancialProfileCreation = (data) => {
  return validateFinancialProfileRegistration(
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

export default router;

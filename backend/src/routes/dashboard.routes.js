import express from "express";
const router = express.Router();

import dashboardController from "../controllers/dashboard.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

/**
 * Dashboard Routes - All GET only
 * Dashboard é read-only, então validação é mínima
 * Apenas verifica se userId existe (já vem do authMiddleware)
 */

// GET - Complete dashboard (user + investments)
router.get(
  "/",
  authMiddleware,
  dashboardController.getDashboard
);

// GET - Only user name
router.get(
  "/name",
  authMiddleware,
  dashboardController.getUserName
);

// GET - Investment data only
router.get(
  "/investments",
  authMiddleware,
  dashboardController.getInvestments
);

export default router;

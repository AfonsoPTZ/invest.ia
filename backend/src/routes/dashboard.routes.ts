import { Router } from "express";
const router: Router = Router();

import dashboardController from "../controllers/dashboard.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authContextMiddleware from "../middlewares/auth-context.middleware.js";

/**
 * Dashboard Routes - All GET only
 * Dashboard é read-only, então validação é mínima
 * Apenas verifica se userId existe (já vem do authMiddleware)
 */

// GET - Complete dashboard (user + investments)
router.get(
  "/",
  authMiddleware,
  authContextMiddleware,
  (req, res) => dashboardController.getDashboard(req, res)
);

// GET - Only user name
router.get(
  "/name",
  authMiddleware,
  authContextMiddleware,
  (req, res) => dashboardController.getUserName(req, res)
);

// GET - Investment data only
router.get(
  "/investments",
  authMiddleware,
  authContextMiddleware,
  (req, res) => dashboardController.getInvestments(req, res)
);

export default router;

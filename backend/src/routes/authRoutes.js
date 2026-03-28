// Authentication Routes
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public
router.post("/register", authController.registerController);
router.post("/login", authController.loginController);

// Protected (require token)
router.post("/logout", authMiddleware, authController.logoutController);
router.get("/me", authMiddleware, authController.getMeController);

module.exports = router;
// Validation Middleware - Using express-validator + cpf-cnpj-validator + libphonenumber-js
// Routes -> Validation Middleware -> Controller -> Service -> Repository

const { body, validationResult } = require("express-validator");
const { cpf } = require("cpf-cnpj-validator");
const { parsePhoneNumberFromString } = require("libphonenumber-js");

// Validation rules for register
const registerValidationRules = () => {
  return [
    body("name")
      .notEmpty().withMessage("Name is required")
      .isLength({ min: 3 }).withMessage("Name must have at least 3 characters"),

    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Email format is invalid"),

    body("cpf")
      .notEmpty().withMessage("CPF is required")
      .custom((value) => {
        const cleanCpf = String(value).replace(/\D/g, "");
        if (!cpf.isValid(cleanCpf)) {
          throw new Error("CPF invalid");
        }
        return true;
      }),

    body("phone")
      .notEmpty().withMessage("Phone is required")
      .custom((value) => {
        const raw = String(value).trim();
        const phone = raw.startsWith("+")
          ? parsePhoneNumberFromString(raw)
          : parsePhoneNumberFromString(raw, "BR");

        if (!phone || !phone.isValid()) {
          throw new Error("Phone invalid");
        }
        return true;
      }),

    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must have at least 6 characters"),
  ];
};

// Validation rules for login
const loginValidationRules = () => {
  return [
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Email format is invalid"),

    body("password")
      .notEmpty().withMessage("Password is required"),
  ];
};

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return res.status(400).json({
      status: "error",
      message: errorMessages.join(", "),
      errors: errors.array(),
    });
  }

  next();
};

// Validation rules for email verification with OTP
const validateEmailVerificationRules = () => {
  return [
    body("userId")
      .notEmpty().withMessage("User ID is required")
      .isInt({ min: 1 }).withMessage("User ID must be a positive integer"),

    body("otpCode")
      .notEmpty().withMessage("OTP code is required")
      .trim()
      .customSanitizer((value) => {
        // Remove all non-digit characters (spaces, dashes, etc)
        return String(value).replace(/\D/g, "");
      })
      .matches(/^\d{6}$/).withMessage("OTP code must be 6 digits"),
  ];
};

// Validation rules for resend OTP
const validateResendOtpRules = () => {
  return [
    body("userId")
      .notEmpty().withMessage("User ID is required")
      .isInt({ min: 1 }).withMessage("User ID must be a positive integer"),
  ];
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  validateEmailVerificationRules,
  validateResendOtpRules,
  handleValidationErrors,
};
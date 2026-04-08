// User Validator - Using professional libraries
// - validator (email, utilities)
// - cpf-cnpj-validator (CPF algorithm)
// - libphonenumber-js (Brazilian phone with DDD)

import validator from "validator";
import { cpf as validateCPFLib } from "cpf-cnpj-validator";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

// CPF validation using cpf-cnpj-validator library
function validateCPF(cpf: any): any {
  if (!cpf) {
    return {
      isValid: false,
      error: "CPF is required"
    };
  }

  const cleanCPF: string = cpf.replace(/[^\d]/g, "");

  // Check if has 11 digits
  if (cleanCPF.length !== 11) {
    return {
      isValid: false,
      error: "CPF must have 11 digits"
    };
  }

  // Use library to validate CPF with algorithm
  const isCPFValid: boolean = validateCPFLib.isValid(cleanCPF);

  if (!isCPFValid) {
    return {
      isValid: false,
      error: "CPF is invalid (verification digits mismatch)"
    };
  }

  return {
    isValid: true,
    cleanedCPF: cleanCPF
  };
}

// Email validation using express-validator library
function validateEmail(email: any): any {
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      error: "Email is required"
    };
  }

  const trimmedEmail: string = email.trim().toLowerCase();

  // Use validator.isEmail
  if (!validator.isEmail(trimmedEmail)) {
    return {
      isValid: false,
      error: "Email format is invalid"
    };
  }

  // Check max length (RFC 5321)
  if (trimmedEmail.length > 254) {
    return {
      isValid: false,
      error: "Email is too long (max 254 characters)"
    };
  }

  return {
    isValid: true,
    cleanedEmail: trimmedEmail
  };
}

// Phone validation using libphonenumber-js library (Brazilian phones)
function validatePhone(phone: any): any {
  if (!phone) {
    return {
      isValid: false,
      error: "Phone is required"
    };
  }

  try {
    // Parse using libphonenumber-js with BR country code
    const parsedPhone: any = parsePhoneNumber(phone, "BR");

    // Check if parsed successfully and is valid
    if (!parsedPhone || !isValidPhoneNumber(phone, "BR")) {
      return {
        isValid: false,
        error: "Phone number is invalid (must include DDD and be in format: (11) 98765-4321 or 11 98765-4321)"
      };
    }

    // Extract cleaned phone (only digits)
    const cleanPhone: string = parsedPhone.nationalNumber?.toString() || phone.replace(/[^\d]/g, "");

    // Additional check for Brazilian phone length (10-11 digits)
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return {
        isValid: false,
        error: "Phone must have 10 or 11 digits (DDD + number)"
      };
    }

    // Extract DDD (first 2 digits)
    const ddd: string = cleanPhone.substring(0, 2);
    
    // Valid Brazilian DDD codes
    const validDDDs: string[] = [
      "11", "12", "13", "14", "15", "16", "17", "18", "19", // São Paulo
      "21", "22", "24", // Rio de Janeiro
      "27", "28", // Espírito Santo
      "31", "32", "33", "34", "35", "37", "38", // Minas Gerais
      "41", "42", "43", "44", "45", "46", // Paraná
      "47", "48", "49", // Santa Catarina
      "51", "53", "54", "55", // Rio Grande do Sul
      "61", // Distrito Federal
      "62", "64", // Goiás
      "63", // Tocantins
      "65", "66", // Mato Grosso
      "67", // Mato Grosso do Sul
      "68", // Acre
      "69", // Rondônia
      "71", "73", "74", "75", "77", // Bahia
      "79", // Sergipe
      "82", // Alagoas
      "85", "88", // Ceará
      "86", "89", // Piauí
      "87", "89", // Pernambuco
      "92", "97", // Amazonas
      "93", "94", "95", "96", // Pará
      "98", "99" // Maranhão
    ];

    if (!validDDDs.includes(ddd)) {
      return {
        isValid: false,
        error: `Invalid DDD (${ddd}) - must be a valid Brazilian area code`
      };
    }

    return {
      isValid: true,
      cleanedPhone: cleanPhone
    };

  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : String(error);
    return {
      isValid: false,
      error: "Phone parsing error: " + errorMessage
    };
  }
}

// Name validation
function validateName(name: any): any {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: "Name is required"
    };
  }

  const trimmedName: string = name.trim();

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      error: "Name must be at least 2 characters long"
    };
  }

  if (trimmedName.length > 100) {
    return {
      isValid: false,
      error: "Name must not exceed 100 characters"
    };
  }

  return {
    isValid: true,
    cleanedName: trimmedName
  };
}

// Password validation (strength check)
function validatePassword(password: any): any {
  if (!password) {
    return {
      isValid: false,
      error: "Password is required"
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: "Password must have at least 6 characters"
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      error: "Password is too long (max 128 characters)"
    };
  }

  // Optional: check password strength
  const hasUpperCase: boolean = /[A-Z]/.test(password);
  const hasLowerCase: boolean = /[a-z]/.test(password);
  const hasNumbers: boolean = /\d/.test(password);
  const hasSpecialChar: boolean = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const strengthScore: number = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  // Warn if weak (but still accept it)
  if (strengthScore < 2) {
    return {
      isValid: true,
      warning: "Password is weak - consider using uppercase, lowercase, numbers and special characters",
      strength: strengthScore
    };
  }

  return {
    isValid: true,
    strength: strengthScore
  };
}

// Validate registration data (all fields)
function validateUserRegistration(name: any, email: any, cpf: any, phone: any, password: any): any {
  const errors: string[] = [];

  // Validate name
  const nameValidation: any = validateName(name);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.error);
  }

  // Validate email
  const emailValidation: any = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.error);
  }

  // Validate CPF
  const cpfValidation: any = validateCPF(cpf);
  if (!cpfValidation.isValid) {
    errors.push(cpfValidation.error);
  }

  // Validate phone
  const phoneValidation: any = validatePhone(phone);
  if (!phoneValidation.isValid) {
    errors.push(phoneValidation.error);
  }

  // Validate password
  const passwordValidation: any = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(passwordValidation.error);
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors: errors
    };
  }

  return {
    isValid: true,
    cleanedData: {
      name: nameValidation.cleanedName,
      email: emailValidation.cleanedEmail,
      cpf: cpfValidation.cleanedCPF,
      phone: phoneValidation.cleanedPhone,
      password: password
    }
  };
}

/**
 * Validar login do usuário
 */
function validateUserLogin(email: any, password: any): any {
  const errors: string[] = [];

  // Validate email
  const emailValidation: any = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.error);
  }

  // Validate password
  if (!password || password.length === 0) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors: errors
    };
  }

  return {
    isValid: true,
    cleanedData: {
      email: emailValidation.cleanedEmail,
      password: password
    }
  };
}

/**
 * Validar verificação de OTP
 */
function validateOtpVerification(userId: any, otpCode: any): any {
  const errors: string[] = [];

  // Validate userId
  if (!userId || !Number.isInteger(parseInt(userId)) || parseInt(userId) < 1) {
    errors.push("Valid User ID is required");
  }

  // Validate OTP code format
  if (!otpCode || typeof otpCode !== "string") {
    errors.push("OTP code is required");
  } else {
    const cleanOtp: string = String(otpCode).replace(/\D/g, "");
    if (cleanOtp.length !== 6) {
      errors.push("OTP code must be 6 digits");
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors: errors
    };
  }

  return {
    isValid: true,
    cleanedData: {
      userId: parseInt(userId),
      otpCode: String(otpCode).replace(/\D/g, "")
    }
  };
}

/**
 * Validar resend OTP
 */
function validateResendOtp(userId: any): any {
  // Validate userId
  if (!userId || !Number.isInteger(parseInt(userId)) || parseInt(userId) < 1) {
    return {
      isValid: false,
      error: "Valid User ID is required"
    };
  }

  return {
    isValid: true,
    cleanedData: {
      userId: parseInt(userId)
    }
  };
}

export {
  validateCPF,
  validateEmail,
  validatePhone,
  validateName,
  validatePassword,
  validateUserRegistration,
  validateUserLogin,
  validateOtpVerification,
  validateResendOtp
};

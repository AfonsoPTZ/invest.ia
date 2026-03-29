// User Validator - Using professional libraries
// - validator (email, utilities)
// - cpf-cnpj-validator (CPF algorithm)
// - libphonenumber-js (Brazilian phone with DDD)

const { isEmail } = require("validator");
const { cpf: validateCPFLib } = require("cpf-cnpj-validator");
const { parsePhoneNumber, isValidPhoneNumber } = require("libphonenumber-js");

// CPF validation using cpf-cnpj-validator library
function validateCPF(cpf) {
  if (!cpf) {
    return {
      isValid: false,
      error: "CPF is required"
    };
  }

  const cleanCPF = cpf.replace(/[^\d]/g, "");

  // Check if has 11 digits
  if (cleanCPF.length !== 11) {
    return {
      isValid: false,
      error: "CPF must have 11 digits"
    };
  }

  // Use library to validate CPF with algorithm
  const isCPFValid = validateCPFLib.isValid(cleanCPF);

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
function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      error: "Email is required"
    };
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Use express-validator isEmail
  if (!isEmail(trimmedEmail)) {
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
function validatePhone(phone) {
  if (!phone) {
    return {
      isValid: false,
      error: "Phone is required"
    };
  }

  try {
    // Parse using libphonenumber-js with BR country code
    const parsedPhone = parsePhoneNumber(phone, "BR");

    // Check if parsed successfully and is valid
    if (!parsedPhone || !isValidPhoneNumber(phone, "BR")) {
      return {
        isValid: false,
        error: "Phone number is invalid (must include DDD and be in format: (11) 98765-4321 or 11 98765-4321)"
      };
    }

    // Extract cleaned phone (only digits)
    const cleanPhone = parsedPhone.nationalNumber?.toString() || phone.replace(/[^\d]/g, "");

    // Additional check for Brazilian phone length (10-11 digits)
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return {
        isValid: false,
        error: "Phone must have 10 or 11 digits (DDD + number)"
      };
    }

    // Extract DDD (first 2 digits)
    const ddd = cleanPhone.substring(0, 2);
    
    // Valid Brazilian DDD codes
    const validDDDs = [
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
    return {
      isValid: false,
      error: "Phone parsing error: " + error.message
    };
  }
}

// Name validation
function validateName(name) {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: "Name is required"
    };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 3) {
    return {
      isValid: false,
      error: "Name must have at least 3 characters"
    };
  }

  if (trimmedName.length > 100) {
    return {
      isValid: false,
      error: "Name is too long (max 100 characters)"
    };
  }

  // Check if contains only letters, spaces, hyphens and apostrophes
  if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(trimmedName)) {
    return {
      isValid: false,
      error: "Name contains invalid characters"
    };
  }

  return {
    isValid: true,
    cleanedName: trimmedName
  };
}

// Password validation (strength check)
function validatePassword(password) {
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
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

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
function validateUserRegistration(name, email, cpf, phone, password) {
  const errors = [];

  // Validate name
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.error);
  }

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.error);
  }

  // Validate CPF
  const cpfValidation = validateCPF(cpf);
  if (!cpfValidation.isValid) {
    errors.push(cpfValidation.error);
  }

  // Validate phone
  const phoneValidation = validatePhone(phone);
  if (!phoneValidation.isValid) {
    errors.push(phoneValidation.error);
  }

  // Validate password
  const passwordValidation = validatePassword(password);
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

module.exports = {
  validateCPF,
  validateEmail,
  validatePhone,
  validateName,
  validatePassword,
  validateUserRegistration
};

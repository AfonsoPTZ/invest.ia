// Validator Middleware - Generic validator wrapper
// Executa validator antes de chamar controller
// Se validação falhar: retorna erro
// Se validação passar: chama controller

const logger = require("../utils/logger");

/**
 * Generic validator middleware
 * 
 * Usage: validatorMiddleware(validator, validationType)
 * 
 * @param {Function} validatorFunction - Função que valida (deve retornar {isValid, error, cleanedData})
 * @param {string} validationType - Tipo de validação (para logs)
 * @returns {Function} Middleware que valida e chama controller
 */
function validatorMiddleware(validatorFunction, validationType = "validation") {
  return async (request, response, next) => {
    try {
      // Get data from request body
      const data = request.body;

      logger.info({ validationType, data }, `Starting ${validationType}`);

      // Call validator function
      const validation = await validatorFunction(data);

      // Check if validation failed
      if (!validation.isValid) {
        logger.warn({ validationType, error: validation.error }, `${validationType} failed`);

        return response.status(400).json({
          status: "error",
          message: validation.error || "Validation failed"
        });
      }

      // Attach cleaned data to request for controller
      request.validatedData = validation.cleanedData || data;

      logger.debug({ validationType }, `${validationType} passed successfully`);

      // Call next middleware/controller
      next();

    } catch (error) {
      logger.error({ validationType, error: error.message }, `Error during ${validationType}`);

      return response.status(400).json({
        status: "error",
        message: error.message || "Validation error"
      });
    }
  };
}

module.exports = validatorMiddleware;

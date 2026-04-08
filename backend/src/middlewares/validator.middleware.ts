// Validator Middleware - Generic validator wrapper
// Executa validator antes de chamar controller
// Se validação falhar: retorna erro
// Se validação passar: chama controller

import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js";

/**
 * Generic validator middleware
 * 
 * Usage: validatorMiddleware(validator, validationType)
 * 
 * @param validatorFunction - Função que valida (deve retornar {isValid, error, cleanedData})
 * @param validationType - Tipo de validação (para logs)
 * @returns Middleware que valida e chama controller
 */
function validatorMiddleware(
  validatorFunction: (data: any) => Promise<{ isValid: boolean; error?: string; cleanedData?: any }>,
  validationType: string = "validation"
) {
  return async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    try {
      // Get data from request body
      const data: any = request.body;

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
      (request as any).validatedData = validation.cleanedData || data;

      logger.debug({ validationType }, `${validationType} passed successfully`);

      // Call next middleware/controller
      next();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error({ validationType, error: errorMessage }, `Error during ${validationType}`);

      return response.status(400).json({
        status: "error",
        message: errorMessage || "Validation error"
      });
    }
  };
}

export default validatorMiddleware;

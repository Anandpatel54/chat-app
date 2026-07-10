import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import ApiError from '../utils/apiError';

type ValidationTarget = 'body' | 'query' | 'params';

const validate = (schema: ZodSchema, target: ValidationTarget = 'body') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[target]);
      req[target] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(ApiError.badRequest('Validation failed', errors));
      } else {
        next(error);
      }
    }
  };
};

export default validate;

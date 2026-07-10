import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError';

const errorMiddleware = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map(
      (e: any) => e.message
    );
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation Error',
      errors,
    });
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Invalid ID format',
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0];
    res.status(409).json({
      success: false,
      statusCode: 409,
      message: `Duplicate value for field: ${field}`,
    });
    return;
  }

  // Default error
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';

import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';
import { TErrorDetails } from '../interface/error';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (
    err instanceof AppError &&
    err.message?.includes('trainees allowed per ')
  ) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: `Class schedule is full. Maximum 10 trainees allowed per schedule.`,
    });
    return;
  }

  if (err instanceof AppError && err.message?.includes('perform')) {
    const matched = err.message.match(/You must be an (.+?) to perform/);
    const requiredRole = matched ? matched[1] : 'authorized user';

    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized access.',
      errorDetails: `You must be an ${requiredRole} to perform this action.`,
    });
    return;
  }

  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorDetails: TErrorDetails = {
    field: '',
    message: 'Something went wrong',
  };

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorDetails = simplifiedError?.errorDetails;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorDetails = simplifiedError?.errorDetails;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorDetails = simplifiedError?.errorDetails;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorDetails = simplifiedError?.errorDetails;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorDetails = {
      field: '',
      message: err?.message,
    };
  } else if (err instanceof Error) {
    message = err.message;
    errorDetails = {
      field: '',
      message: err?.message,
    };
  }

  res.status(statusCode).json({
    success: false,
    statusCode: err?.statusCode,
    message,
    errorDetails,
    stack: config.node_env === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;

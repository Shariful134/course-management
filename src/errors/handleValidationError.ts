import mongoose from 'mongoose';
import { TErrorDetails, TGenericErrorResponse } from '../interface/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const statusCode = 400;

  const errors = Object.values(err.errors) as (
    | mongoose.Error.ValidatorError
    | mongoose.Error.CastError
  )[];

  const firstError = errors[0];

  const errorDetails: TErrorDetails = {
    field: firstError?.path || '',
    message: firstError?.message || 'Validation error occurred.',
  };

  return {
    statusCode,
    message: 'Validation error occurred.',
    errorDetails,
  };
};

export default handleValidationError;

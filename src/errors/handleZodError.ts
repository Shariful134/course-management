import { ZodError, ZodIssue } from 'zod';
import { TErrorDetails, TGenericErrorResponse } from '../interface/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const firstIssue: ZodIssue = err.issues[0];

  const errorDetails: TErrorDetails = {
    field: String(firstIssue?.path[firstIssue?.path.length - 1]),
    message: firstIssue.message,
  };

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation error occurred.',
    errorDetails,
  };
};

export default handleZodError;

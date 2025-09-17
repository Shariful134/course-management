/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorDetails, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);

  const extractedMessage = match && match[1];

  const errorDetails: TErrorDetails = {
    field: '',
    message: `${extractedMessage} is already exists`,
  };

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorDetails,
  };
};

export default handleDuplicateError;

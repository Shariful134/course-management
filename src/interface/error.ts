export type TErrorDetails = {
  field: PropertyKey;
  message: string;
};

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorDetails: TErrorDetails;
};

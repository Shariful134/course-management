"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (err) => {
    const statusCode = 400;
    const errors = Object.values(err.errors);
    const firstError = errors[0];
    const errorDetails = {
        field: (firstError === null || firstError === void 0 ? void 0 : firstError.path) || '',
        message: (firstError === null || firstError === void 0 ? void 0 : firstError.message) || 'Validation error occurred.',
    };
    return {
        statusCode,
        message: 'Validation error occurred.',
        errorDetails,
    };
};
exports.default = handleValidationError;

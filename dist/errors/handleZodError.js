"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (err) => {
    const firstIssue = err.issues[0];
    const errorDetails = {
        field: String(firstIssue === null || firstIssue === void 0 ? void 0 : firstIssue.path[(firstIssue === null || firstIssue === void 0 ? void 0 : firstIssue.path.length) - 1]),
        message: firstIssue.message,
    };
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation error occurred.',
        errorDetails,
    };
};
exports.default = handleZodError;

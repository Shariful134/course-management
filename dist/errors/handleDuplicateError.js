"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    const match = err.message.match(/"([^"]*)"/);
    const extractedMessage = match && match[1];
    const errorDetails = {
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
exports.default = handleDuplicateError;

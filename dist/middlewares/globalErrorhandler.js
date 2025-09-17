"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../errors/AppError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const globalErrorHandler = (err, req, res, next) => {
    var _a, _b;
    if (err instanceof AppError_1.default &&
        ((_a = err.message) === null || _a === void 0 ? void 0 : _a.includes('trainees allowed per '))) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: `Class schedule is full. Maximum 10 trainees allowed per schedule.`,
        });
        return;
    }
    if (err instanceof AppError_1.default && ((_b = err.message) === null || _b === void 0 ? void 0 : _b.includes('perform'))) {
        const matched = err.message.match(/You must be an (.+?) to perform/);
        const requiredRole = matched ? matched[1] : 'authorized user';
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Unauthorized access.',
            errorDetails: `You must be an ${requiredRole} to perform this action.`,
        });
        return;
    }
    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorDetails = {
        field: '',
        message: 'Something went wrong',
    };
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorDetails = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorDetails;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'ValidationError') {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorDetails = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorDetails;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'CastError') {
        const simplifiedError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorDetails = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorDetails;
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorDetails = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorDetails;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err.message;
        errorDetails = {
            field: '',
            message: err === null || err === void 0 ? void 0 : err.message,
        };
    }
    else if (err instanceof Error) {
        message = err.message;
        errorDetails = {
            field: '',
            message: err === null || err === void 0 ? void 0 : err.message,
        };
    }
    res.status(statusCode).json({
        success: false,
        statusCode: err === null || err === void 0 ? void 0 : err.statusCode,
        message,
        errorDetails,
        stack: config_1.default.node_env === 'development' ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
};
exports.default = globalErrorHandler;

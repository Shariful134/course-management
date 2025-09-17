"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fquestionValidation = void 0;
const zod_1 = require("zod");
// Create Schema
const fquestionCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z
            .string({
            required_error: "Question is required",
            invalid_type_error: "Question must be a string",
        })
            .min(5, "Question must be at least 5 characters long")
            .trim(),
        answare: zod_1.z
            .string({
            required_error: "Answer is required",
            invalid_type_error: "Answer must be a string",
        })
            .min(2, "Answer must be at least 2 characters long")
            .trim(),
    }),
});
// Update Schema (optional fields)
const fquestionUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z.string().min(5, "Question must be at least 5 characters long").trim().optional(),
        answare: zod_1.z.string().min(2, "Answer must be at least 2 characters long").trim().optional(),
    }),
});
exports.fquestionValidation = {
    fquestionCreateSchema,
    fquestionUpdateSchema,
};

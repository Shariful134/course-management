"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberShipValidation = void 0;
const zod_1 = require("zod");
// Create MemberShip Schema
const memberShipCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        durationInMonths: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Duration is required",
            invalid_type_error: "Duration must be a number",
        }).positive("Duration must be greater than 0")),
        weekCount: zod_1.z.number().optional(),
        ridesPerMonth: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Rides per month is required",
            invalid_type_error: "Rides per month must be a number",
        }).positive("Rides per month must be greater than 0").max(5, "Rides per month cannot be more than 5")),
        refundableDeposit: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Refundable deposit is required",
            invalid_type_error: "Refundable deposit must be a number",
        }).nonnegative("Refundable deposit cannot be negative")),
        signUpFee: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Sign-up fee is required",
            invalid_type_error: "Sign-up fee must be a number",
        }).nonnegative("Sign-up fee cannot be negative")),
        price: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Pricing is required",
            invalid_type_error: "price must be a number",
        }).positive("price must be greater than 0")),
        planId: zod_1.z
            .string({
            required_error: "planId is required",
            invalid_type_error: "planId must be a string",
        })
            .min(1, "planId cannot be empty")
            .trim().optional(),
        description: zod_1.z
            .string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        })
            .min(1, "Description cannot be empty")
            .trim(),
    }),
});
// Update MemberShip Schema (all fields optional)
const memberShipUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        durationInMonths: zod_1.z.preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().positive("Duration must be greater than 0")).optional(),
        weekCount: zod_1.z.number().optional(),
        ridesPerMonth: zod_1.z.preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().positive("Rides per month must be greater than 0")).optional(),
        refundableDeposit: zod_1.z.preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().nonnegative("Refundable deposit cannot be negative")).optional(),
        signUpFee: zod_1.z.preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().nonnegative("Sign-up fee cannot be negative")).optional(),
        price: zod_1.z.preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().positive("price must be greater than 0")).optional(),
        planId: zod_1.z.string().trim().optional(),
        description: zod_1.z.string().trim().optional(),
    }),
});
exports.memberShipValidation = {
    memberShipCreateSchema,
    memberShipUpdateSchema,
};

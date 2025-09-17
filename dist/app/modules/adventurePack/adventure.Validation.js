"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adventurePackValidation = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const objectId = zod_1.z
    .string({
    required_error: "ObjectId is required",
    invalid_type_error: "ObjectId must be a string",
})
    .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId",
});
// Create AdventurePack Schema
const adventurePackCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        jet_skyId: objectId,
        title: zod_1.z
            .string({
            required_error: "Title is required",
            invalid_type_error: "Title must be a string",
        })
            .min(1, "Title cannot be empty")
            .trim(),
        discountPercentage: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Discount percentage is required",
            invalid_type_error: "Discount must be a number",
        })
            .min(0, "Discount cannot be negative")
            .max(100, "Discount cannot be more than 100")),
        ridesPricing3: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "3-ride pricing is required",
            invalid_type_error: "3-ride pricing must be a number",
        }).positive("3-ride pricing must be greater than 0")),
        ridesPricing5: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "5-ride pricing is required",
            invalid_type_error: "5-ride pricing must be a number",
        }).positive("5-ride pricing must be greater than 0")),
        ridesPricing10: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "10-ride pricing is required",
            invalid_type_error: "10-ride pricing must be a number",
        }).positive("10-ride pricing must be greater than 0")),
        refundAmount: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Refund amount is required",
            invalid_type_error: "Refund amount must be a number",
        }).nonnegative("Refund amount cannot be negative")),
        feature_list: zod_1.z
            .array(zod_1.z.string())
            .nonempty("Feature list cannot be empty")
            .optional(),
    }),
});
// Update AdventurePack Schema
const adventurePackUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        jet_skyId: objectId.optional(),
        title: zod_1.z
            .string()
            .trim()
            .optional(),
        discountPercentage: zod_1.z
            .preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().min(0).max(100))
            .optional(),
        ridesPricing3: zod_1.z
            .preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().positive())
            .optional(),
        ridesPricing5: zod_1.z
            .preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().positive())
            .optional(),
        ridesPricing10: zod_1.z
            .preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().positive())
            .optional(),
        refundAmount: zod_1.z
            .preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().nonnegative())
            .optional(),
        feature_list: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.adventurePackValidation = {
    adventurePackCreateSchema,
    adventurePackUpdateSchema,
};

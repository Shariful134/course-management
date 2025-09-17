"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const objectId = zod_1.z
    .string()
    .refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId",
});
// Create Rent Schema
const rentCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        jet_skyId: objectId,
        model: zod_1.z.string().nonempty("Model is required").trim(),
        hp: zod_1.z.number().refine((val) => typeof val === "number", { message: "hp must be a number, but received string" }),
        price: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().positive("Pricing must be greater than 0")),
        feature_list: zod_1.z
            .array(zod_1.z.string())
            .nonempty("Feature list cannot be empty"),
    }),
});
// Update Rent Schema
const rentUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        model: zod_1.z.string().trim().optional(),
        hp: zod_1.z.number().refine((val) => typeof val === "number", { message: "hp must be a number, but received string" }).optional(),
        price: zod_1.z.preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().positive("Price must be greater than 0")).optional(),
        feature_list: zod_1.z.array(zod_1.z.string()).nonempty("Feature list cannot be empty").optional(),
    }),
});
exports.rentValidation = {
    rentCreateSchema,
    rentUpdateSchema,
};

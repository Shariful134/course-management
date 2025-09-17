"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jetSkyValidation = void 0;
const zod_1 = require("zod");
const jetSkyCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
        })
            .min(1, "Name cannot be empty")
            .trim(),
        model: zod_1.z
            .string({
            required_error: "Model is required",
            invalid_type_error: "Model must be a string",
        })
            .min(1, "Model cannot be empty")
            .trim(),
        hp: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Horsepower is required",
            invalid_type_error: "Horsepower must be a number",
        }).positive("Horsepower must be greater than 0")),
        price: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Price is required",
            invalid_type_error: "Price must be a number",
        }).positive("Price must be greater than 0")),
        description: zod_1.z
            .string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        })
            .min(1, "Description cannot be empty")
            .trim(),
        image: zod_1.z
            .string({
            required_error: "Image is required",
            invalid_type_error: "Image must be a string",
        })
            .min(1, "Image cannot be empty")
            .trim()
            .optional(),
    }),
});
// Update JetSky Schema (all fields optional)
const jetSkyUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().optional(),
        model: zod_1.z.string().trim().optional(),
        hp: zod_1.z.preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number({
            required_error: "Horsepower is required",
            invalid_type_error: "Horsepower must be a number",
        }).positive("Horsepower must be greater than 0")).optional(),
        price: zod_1.z.preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number({
            required_error: "Price is required",
            invalid_type_error: "Price must be a number",
        }).positive("Price must be greater than 0")).optional(),
        description: zod_1.z.string().trim().optional(),
        image: zod_1.z
            .string({
            required_error: "Image URL Link is required",
            invalid_type_error: "Image must be a string",
        })
            .trim()
            .optional(),
    }),
});
exports.jetSkyValidation = {
    jetSkyCreateSchema,
    jetSkyUpdateSchema,
};

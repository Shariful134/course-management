"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseValidation = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
// Create Course Schema
const createCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().nonempty("Course title is required").trim(),
        description: zod_1.z.string().nonempty("Course description is required").trim(),
        price: zod_1.z
            .number({ invalid_type_error: "Price must be a number" })
            .positive("Price must be greater than 0"),
        instructor: zod_1.z
            .string()
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val), "Invalid instructor ID"),
        thumbnailImage: zod_1.z
            .string()
            .nonempty("Thumbnail image URL is required")
            .trim(),
        isPopular: zod_1.z.boolean().optional(),
    }),
});
// Update Course Schema
const updateCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim().optional(),
        description: zod_1.z.string().trim().optional(),
        price: zod_1.z
            .number({ invalid_type_error: "Price must be a number" })
            .positive("Price must be greater than 0")
            .optional(),
        instructor: zod_1.z
            .string()
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val), "Invalid instructor ID")
            .optional(),
        thumbnailImage: zod_1.z.string().trim().optional(),
        isPopular: zod_1.z.boolean().optional(),
    }),
});
exports.courseValidation = {
    createCourseSchema,
    updateCourseSchema,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = exports.userRoleEnum = void 0;
const zod_1 = require("zod");
// Role enum fix
exports.userRoleEnum = zod_1.z
    .enum(["admin", "student", "instructor"])
    .default("student");
// Register Schema
const userRegisterSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty("Name is required").trim(),
        email: zod_1.z
            .string()
            .nonempty("Email is required")
            .email("Invalid email format")
            .trim(),
        password: zod_1.z
            .string()
            .min(6, "Password must be at least 6 characters")
            .trim(),
        role: exports.userRoleEnum.optional(),
    }),
});
// Update Schema
const userRegisterUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().optional(),
        email: zod_1.z.string().email("Invalid email format").trim().optional(),
        password: zod_1.z
            .string()
            .min(6, "Password must be at least 6 characters")
            .trim()
            .optional(),
        role: exports.userRoleEnum.optional(),
    }),
});
// Change Password Schema
const changesPasswordUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().nonempty("Current Password is required").trim(),
        newPassword: zod_1.z
            .string()
            .min(6, "New Password must be at least 6 characters")
            .trim(),
    }),
});
// Login Schema
const loginValidationschema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .nonempty("Email is required")
            .email("Invalid email format"),
        password: zod_1.z.string().nonempty("Password is required"),
    }),
});
exports.authValidation = {
    userRegisterSchema,
    loginValidationschema,
    userRegisterUpdateSchema,
    changesPasswordUpdateSchema,
};

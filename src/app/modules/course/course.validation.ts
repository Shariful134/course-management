import { z } from "zod";
import { Types } from "mongoose";

// Create Course Schema
const createCourseSchema = z.object({
  body: z.object({
    title: z.string().nonempty("Course title is required").trim(),
    description: z.string().nonempty("Course description is required").trim(),
    price: z
      .number({ invalid_type_error: "Price must be a number" })
      .positive("Price must be greater than 0"),
    instructor: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), "Invalid instructor ID"),
    thumbnailImage: z
      .string()
      .nonempty("Thumbnail image URL is required")
      .trim(),
    isPopular: z.boolean().optional(),
  }),
});

// Update Course Schema
const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().trim().optional(),
    description: z.string().trim().optional(),
    price: z
      .number({ invalid_type_error: "Price must be a number" })
      .positive("Price must be greater than 0")
      .optional(),
    instructor: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), "Invalid instructor ID")
      .optional(),
    thumbnailImage: z.string().trim().optional(),
    isPopular: z.boolean().optional(),
  }),
});

export const courseValidation = {
  createCourseSchema,
  updateCourseSchema,
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidation = void 0;
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
const adventurePackBookingValidation = zod_1.z.object({
    body: zod_1.z.object({
        userId: objectId,
        adventurePackId: objectId.optional(),
        ridesNumber: zod_1.z.preprocess((val) => Number(val), zod_1.z
            .number({
            required_error: "Rides number is required",
            invalid_type_error: "Rides number must be a number",
        })
            .int("Rides number must be an integer")
            .positive("Rides number must be greater than 0")),
        price: zod_1.z.preprocess((val) => Number(val), zod_1.z
            .number({
            required_error: "Price is required",
            invalid_type_error: "Price must be a number",
        })
            .positive("Price must be greater than 0")),
    }),
});
const jetSkyBookingValidation = zod_1.z.object({
    body: zod_1.z.object({
        userId: objectId,
        jetSkyId: objectId.optional(),
    }),
});
// export const paymentUpdateSchema = z.object({
//   body: z.object({
//     userId: objectId.optional(),
//     adventurePackId: objectId.optional(),
//     rentId: objectId.optional(),
//     ridesNumber: z
//       .preprocess((val) => (val !== undefined ? Number(val) : val), z.number().int().positive())
//       .optional(),
//     price: z
//       .preprocess((val) => (val !== undefined ? Number(val) : val), z.number().positive())
//       .optional(),
//   }),
// });
exports.BookingValidation = {
    adventurePackBookingValidation,
    jetSkyBookingValidation
    //   paymentUpdateSchema,
};

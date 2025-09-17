"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successStoryValidation = void 0;
// src/app/modules/successStories/successStory.validation.ts
const zod_1 = require("zod");
const createStorySchema = zod_1.z.object({
    body: zod_1.z.object({
        studentName: zod_1.z.string().nonempty("Student name is required").trim(),
        storyText: zod_1.z.string().nonempty("Story text is required").trim(),
        courseName: zod_1.z.string().nonempty("Course name is required").trim(),
    }),
});
exports.successStoryValidation = {
    createStorySchema,
};

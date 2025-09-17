// src/app/modules/successStories/successStory.validation.ts
import { z } from "zod";

const createStorySchema = z.object({
  body: z.object({
    studentName: z.string().nonempty("Student name is required").trim(),
    storyText: z.string().nonempty("Story text is required").trim(),
    courseName: z.string().nonempty("Course name is required").trim(),
  }),
});

export const successStoryValidation = {
  createStorySchema,
};

import { Schema, model } from "mongoose";
import { ISuccessStory } from "./success.interface";

const successStorySchema = new Schema<ISuccessStory>(
  {
    studentName: { type: String, required: true },
    storyText: { type: String, required: true },
    courseName: { type: String, required: true },
  },
  { timestamps: true }
);

const SuccessStoryModel = model<ISuccessStory>(
  "SuccessStory",
  successStorySchema
);

export default SuccessStoryModel;

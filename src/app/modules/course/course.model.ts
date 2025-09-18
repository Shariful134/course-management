import { Schema, model, Types } from "mongoose";
import { ICourse } from "./course.interface";

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    thumbnailImage: { type: String, required: true },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CourseModel = model<ICourse>("Course", courseSchema);

export default CourseModel;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    instructor: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    thumbnailImage: { type: String, required: true },
    isPopular: { type: Boolean, default: false },
}, { timestamps: true });
const CourseModel = (0, mongoose_1.model)("Course", courseSchema);
exports.default = CourseModel;

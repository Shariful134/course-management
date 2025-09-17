"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const successStorySchema = new mongoose_1.Schema({
    studentName: { type: String, required: true },
    storyText: { type: String, required: true },
    courseName: { type: String, required: true },
}, { timestamps: true });
const SuccessStoryModel = (0, mongoose_1.model)("SuccessStory", successStorySchema);
exports.default = SuccessStoryModel;

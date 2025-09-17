"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fquestion = void 0;
const mongoose_1 = require("mongoose");
const fquestionSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: [true, "Question is required"],
        trim: true,
        minlength: [5, "Question must be at least 5 characters long"],
    },
    answare: {
        type: String,
        required: [true, "Answer is required"],
        trim: true,
        minlength: [2, "Answer must be at least 2 characters long"],
    },
}, { timestamps: true });
exports.Fquestion = (0, mongoose_1.model)("Fquestion", fquestionSchema);

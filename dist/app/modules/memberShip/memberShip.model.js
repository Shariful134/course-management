"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberShip = void 0;
const mongoose_1 = require("mongoose");
const memberShipSchema = new mongoose_1.Schema({
    name: { type: String, required: false }, // e.g., "Weekly Pass", "6-Month Package"
    type: {
        type: String,
        enum: ["recurring", "onetime"],
        required: false,
    },
    interval: {
        type: String,
        enum: ["day", "week", "month", "year"],
        required: function () {
            return this.type === "recurring";
        },
    },
    durationInMonths: {
        type: Number,
        required: function () {
            return this.type === "onetime";
        },
    },
    ridesPerMonth: { type: Number, required: true },
    weekCount: { type: Number, required: false },
    refundableDeposit: { type: Number, required: true },
    signUpFee: { type: Number, required: true },
    price: { type: Number, required: true }, // 💡 I renamed "pricing" → "price" for clarity
    planId: { type: String, required: true },
    description: { type: String, required: true },
}, { timestamps: true });
exports.MemberShip = (0, mongoose_1.model)("MemberShip", memberShipSchema);

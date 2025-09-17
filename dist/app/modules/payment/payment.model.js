"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    adventurePackId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "AdventurePack",
        required: false,
    },
    rentPackId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Rent",
        required: false,
    },
    membershipId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "MemberShip",
        required: false,
    },
    jetSkyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "JetSky",
        required: false,
    },
    email: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    bookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Booking",
        required: false,
    },
    type: {
        type: String,
        enum: ["recurring", "onetime"],
        required: true,
    },
    ridesNumber: {
        type: Number,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    weeklyCharge: {
        type: Number,
        required: false,
    },
    stripePaymentIntentId: { type: String },
    status: {
        type: String,
        enum: ["active", "pending", "canceled", "expired"],
        default: "pending",
    },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
}, { timestamps: true });
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);

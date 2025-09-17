"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = require("mongoose");
const subscriptionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    membershipId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "MemberShip",
        required: true,
    },
    type: {
        type: String,
        enum: ["recurring", "onetime"],
        required: true,
    },
    stripeSubscriptionId: { type: String }, // only for recurring
    stripePaymentIntentId: { type: String }, // used for onetime or signup fee
    status: {
        type: String,
        enum: ["active", "pending", "canceled", "expired"],
        default: "pending",
    },
    startDate: { type: Date, required: true },
    lastCreditAddedAt: { type: Date, required: false },
    endDate: { type: Date, required: true },
    purchesCredits: { type: Number, required: true },
    remainingCredits: { type: Number, required: true },
    signUpFee: { type: Number, required: true },
    price: { type: Number, required: true },
    signUpFeePaid: { type: Boolean, default: false },
    refundableDepositPaid: { type: Boolean, default: false },
}, { timestamps: true });
exports.Subscription = (0, mongoose_1.model)("Subscription", subscriptionSchema);

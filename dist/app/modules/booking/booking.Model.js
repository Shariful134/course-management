"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseAdventurePack = exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    jetSkyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "JetSky",
        required: false,
    },
    adventurePurchaseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "PurchaseAdventurePack",
        required: false,
    },
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
    maintenance: {
        type: Boolean,
        default: false,
        required: false,
    },
    model: {
        type: String,
        trim: true,
        required: false,
    },
    rentPurchaseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "PurchaseRentPack",
        required: false,
    },
    paymentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Payment",
        required: false,
    },
    subscriptionPurchaseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subscription",
        required: false,
    },
    ridesNumber: { type: Number, required: false },
    purchesCredits: { type: Number, required: false },
    remainingCredits: { type: Number, required: false },
    bookingDate: { type: Date, required: false },
    bookingTime: { type: String, required: false },
    type: { type: String, required: false },
    stripePaymentIntentId: { type: String, required: false },
    drivingLicense: { type: String, required: false },
    startDate: { type: Date, required: false },
    expiryDate: { type: Date, required: false },
    notes: { type: String, required: false },
    status: {
        type: String,
        enum: ["inActive", "active", "expired", "cancelled", "canceled", ""],
        default: "inActive",
    },
    price: {
        type: Number,
        required: false
    },
    email: {
        type: String,
        trim: true,
        required: false
    },
    name: {
        type: String,
        trim: true,
        required: false
    },
    totalPrice: {
        type: Number,
        required: false
    },
    refundableDepositPaid: {
        type: Number,
        required: false
    },
    refundableDeposit: {
        type: Number,
        required: false
    },
    refundableBound: {
        type: Boolean,
        required: false,
        default: false
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid", ""],
        default: "unpaid",
    },
}, { timestamps: true });
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
exports.PurchaseAdventurePack = (0, mongoose_1.model)("PurchaseAdventurePack", bookingSchema);
// export const PurchaseRentPack = model<IBooking>("PurchaseRentPack", bookingSchema);
// PurchaseAdventurePack schema (keeps track of pack purchase and remaining credits)
// const purchaseAdventurePackSchema = new Schema({
//   userId: { type: Types.ObjectId, ref: "User", required: true },
//   adventurePackId: { type: Types.ObjectId, ref: "AdventurePack", required: true },
//   model: { type: String, required: true }, // model locked like 'GTI' or similar
//   totalCredits: { type: Number, required: true },
//   remainingCredits: { type: Number, required: true },
//   createdAt: { type: Date, default: Date.now },
// });
// export const PurchaseAdventurePack = model("PurchaseAdventurePack", purchaseAdventurePackSchema);
// // PurchaseRentPack (for day rentals purchases, if you store them as purchases)
// const purchaseRentPackSchema = new Schema({
//   userId: { type: Types.ObjectId, ref: "User", required: true },
//   rentPackId: { type: Types.ObjectId, ref: "Rent", required: true },
//   jet_skyId: { type: Types.ObjectId, ref: "JetSky", required: false },
//   used: { type: Boolean, default: false }, // day rental credit used or not
//   createdAt: { type: Date, default: Date.now },
// });
// export const PurchaseRentPack = model("PurchaseRentPack", purchaseRentPackSchema);

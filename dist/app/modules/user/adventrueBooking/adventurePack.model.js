"use strict";
// import { model, Schema } from "mongoose";
// import { IbookingAdventurePack } from "./adventureBooking.interface";
// const bookingAdventurePackSchema = new Schema<IbookingAdventurePack>(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     jet_skyId: {
//       type: Schema.Types.ObjectId,
//       ref: "JetSky",
//       required: true,
//     },
//     adventurePackId: {
//       type: Schema.Types.ObjectId,
//       ref: "AdventurePack",
//       required: true,
//     },
//     purchasedCredits: { type: Number, required: true },
//     remainingCredits: { type: Number, required: true },
//     startDate: { type: Date, required: true },
//     expiryDate: { type: Date, required: true },
//     status: {
//       type: String,
//       enum: ["active", "expired", "cancelled"],
//       default: "active",
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["paid", "unpaid"],
//       default: "unpaid",
//     },
//   },
//   { timestamps: true }
// );
// export const BookingAdventurePack = model<IbookingAdventurePack>("BookingAdventurePack", bookingAdventurePackSchema);
// // import { Schema, model } from "mongoose";
// // import { IbookingAdventurePack } from "./adventureBooking.interface";
// // const bookingAdventurePackSchema = new Schema<IbookingAdventurePack>(
// //   {
// //     adventurePackId: {
// //       type: Schema.Types.ObjectId,
// //       required: true,
// //       ref: "AdventurePack", 
// //     },
// //     userId: {
// //       type: Schema.Types.ObjectId,
// //       required: true,
// //       ref: "User",
// //     },
// //     ridesNumber: {
// //       type: Number,
// //       required: true,
// //     },
// //     ridesPricing: {
// //       type: Number,
// //       required: true,
// //     },
// //     startDate: {
// //       type: Date,
// //       required: true,
// //     },
// //     expireDate: {
// //       type: Date,
// //       required: true,
// //     },
// //     rideComplete: {
// //       type: Number,
// //       default: 0,
// //     },
// //     rideRemaining: {
// //       type: Number,
// //       required: true,
// //     },
// //   },
// //   {
// //     timestamps: true,
// //     versionKey: false,
// //   }
// // );
// // // BookingAdventurePack Model
// // export const BookingAdventurePack = model<IbookingAdventurePack>(
// //   "BookingAdventurePack",
// //   bookingAdventurePackSchema
// // );

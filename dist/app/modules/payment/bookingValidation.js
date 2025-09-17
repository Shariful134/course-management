"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidateion = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const jet_model_1 = require("../jet-sky/jet.model");
const booking_Model_1 = require("../booking/booking.Model");
const auth_model_1 = require("../auth/auth.model");
const rents_model_1 = require("../rents/rents.model");
const bookingValidateion = (payload_1, ...args_1) => __awaiter(void 0, [payload_1, ...args_1], void 0, function* (payload, isAdmin = false) {
    console.log("in validate");
    // 0. User & Jet Ski Validation
    const userData = yield auth_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
    const rentPackData = yield rents_model_1.Rent.findById(payload === null || payload === void 0 ? void 0 : payload.rentPackId).populate("jet_skyId");
    console.log("rentPackData: ", rentPackData);
    const jetSkyData = yield jet_model_1.JetSky.findById(rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.jet_skyId);
    if (!rentPackData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'rentPack not found!');
    }
    if (!jetSkyData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet_Sky not found!');
    }
    if (!userData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found!');
    }
    // . limit 14 days without (Admin)
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let startDate = new Date(payload.bookingDate);
    startDate.setHours(0, 0, 0, 0);
    const diffInDays = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (!isAdmin && diffInDays > 14) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You can only book up to 14 days in advance!');
    }
    // 2. Availability check 
    const totalJetSkiesOfModel = yield jet_model_1.JetSky.countDocuments({ model: jetSkyData === null || jetSkyData === void 0 ? void 0 : jetSkyData.model });
    // console.log(rentPackData, "rentPackData")
    const bookedCount = yield booking_Model_1.Booking.countDocuments({
        bookingDate: payload.bookingDate,
        // status: 'active',
        jetSkyId: { $in: (yield jet_model_1.JetSky.find({ model: jetSkyData.model })).map(j => j._id) }
    });
    if (bookedCount >= totalJetSkiesOfModel) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `Sorry, all ${jetSkyData.model} Jet Skis are already booked for this date!`);
    }
});
exports.bookingValidateion = bookingValidateion;

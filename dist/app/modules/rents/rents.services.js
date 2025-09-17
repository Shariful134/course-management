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
exports.rentServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const rents_model_1 = require("./rents.model");
const jet_model_1 = require("../jet-sky/jet.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const rent_Constant_1 = require("./rent.Constant");
const booking_Model_1 = require("../booking/booking.Model");
const date_fns_1 = require("date-fns");
// create Rent
const createRentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const jet_sky = yield jet_model_1.JetSky.findById(payload.jet_skyId);
    if (!jet_sky) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet_Sky is not Found!');
    }
    const hp = jet_sky === null || jet_sky === void 0 ? void 0 : jet_sky.hp;
    const modelNumber = jet_sky === null || jet_sky === void 0 ? void 0 : jet_sky.model;
    if (hp != (payload === null || payload === void 0 ? void 0 : payload.hp)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'HorsePower is not Match!');
    }
    if (modelNumber != (payload === null || payload === void 0 ? void 0 : payload.model)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet_Sky Model is not Match!');
    }
    const result = yield rents_model_1.Rent.create(payload);
    return result;
});
// Get Single Rent
const getSingleRentIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rents_model_1.Rent.findById(id).populate("jet_skyId");
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Rent is not Found!');
    }
    return result;
});
// Get All Rent
const getAllRentIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const rentQuery = new QueryBuilder_1.default(rents_model_1.Rent.find().populate("jet_skyId"), query).search(rent_Constant_1.rentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield rentQuery.modelQuery;
    const meta = yield rentQuery.countTotal();
    // const result = await Rent.find().populate("jet_skyId");
    //checking Rent is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Rent is not Found!');
    }
    return { result, meta };
});
// Get All Rent
const getAvailableDatesForJetskiIntoDB = (date) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Define start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    // Step 2: Find all bookings on this date
    const bookings = yield booking_Model_1.Booking.find({
        bookingDate: { $gte: startOfDay, $lte: endOfDay },
    }).select("rentPackId");
    // Step 3: Collect booked rentPackIds
    const bookedRentPackIds = bookings.map((b) => b.rentPackId.toString());
    // Step 4: Find all rents (jetskis)
    const allRents = yield rents_model_1.Rent.find();
    // Step 5: Mark available vs booked
    const availability = allRents.map((rent) => ({
        rentPackId: rent._id.toString(),
        model: rent.model,
        price: rent.price,
        status: bookedRentPackIds.includes(rent._id.toString()) ? "booked/maintenance" : "available",
    }));
    return availability;
});
const getAvailableDatesForSpesificJetskiIntoDB = (model) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const monthStart = (0, date_fns_1.startOfMonth)(today);
    const monthEnd = (0, date_fns_1.endOfMonth)(today);
    const bookings = yield booking_Model_1.Booking.find({
        model,
        bookingDate: { $gte: monthStart, $lte: monthEnd },
    }).select("bookingDate rentPackId");
    const bookedDates = bookings.map((b) => new Date(b.bookingDate).toISOString().split("T")[0]);
    const allDatesInMonth = (0, date_fns_1.eachDayOfInterval)({
        start: monthStart,
        end: monthEnd,
    }).map((d) => d.toISOString().split("T")[0]);
    const availableDates = allDatesInMonth.filter((date) => !bookedDates.includes(date));
    return {
        model,
        availableDates,
        bookedDates,
    };
});
//Updated Rent
const updateRentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const rent = yield rents_model_1.Rent.findById(id);
    if (!rent) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Rent is not Found!');
    }
    const jetSky = yield jet_model_1.JetSky.findById(rent === null || rent === void 0 ? void 0 : rent.jet_skyId);
    if (!jetSky) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'jetSky is not Found!');
    }
    const hp = jetSky === null || jetSky === void 0 ? void 0 : jetSky.hp;
    const modelNumber = jetSky === null || jetSky === void 0 ? void 0 : jetSky.model;
    if (payload === null || payload === void 0 ? void 0 : payload.hp) {
        if (hp != (payload === null || payload === void 0 ? void 0 : payload.hp)) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'This JetSky Horsepower has no HorsePower!');
        }
    }
    if (payload === null || payload === void 0 ? void 0 : payload.model) {
        if (modelNumber != (payload === null || payload === void 0 ? void 0 : payload.model)) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'This JetSky Model has no HorsePower!');
        }
    }
    const result = yield rents_model_1.Rent.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Rent is not Found!');
    }
    return result;
});
// Delete Rent
const deleteRentIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rents_model_1.Rent.findByIdAndDelete(id);
    //checking Rent is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Rent is not Found!');
    }
    return result;
});
exports.rentServices = {
    createRentIntoDB,
    getSingleRentIntoDB,
    getAllRentIntoDB,
    updateRentIntoDB,
    deleteRentIntoDB,
    getAvailableDatesForJetskiIntoDB,
    getAvailableDatesForSpesificJetskiIntoDB,
};

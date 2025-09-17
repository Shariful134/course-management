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
exports.BookingContnrollers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const booking_Services_1 = require("./booking.Services");
//create JetSky
const createBookingJetSky = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = req.body;
    // if usre is admin then no limit of days
    const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "Admin";
    const result = yield booking_Services_1.BookingServices.createBookingJetSkyIntoDB(payload, isAdmin);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'JetSky Booking Successfully',
        data: [result],
    });
}));
//create Booking by Admin
const createBookingJetSkyByAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = req.body;
    const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "Admin";
    const result = yield booking_Services_1.BookingServices.createBookingJetSkyByAdminIntoDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `JetSky Booking by ${isAdmin} AdSuccessfully`,
        data: result,
    });
}));
//create AdventurePack
const purchaseAdventurePack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    console.log(payload);
    const result = yield booking_Services_1.BookingServices.purchasegAdventurePackIntoDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'AdventurePack Purchase Successfully',
        data: [result],
    });
}));
//create booking RentPack
const purchaseRentPack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    console.log(payload);
    const result = yield booking_Services_1.BookingServices.purchasegRentPackIntoDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Rent Purchase Successfully',
        data: [result],
    });
}));
//getAll Booking
const getAllBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, meta } = yield booking_Services_1.BookingServices.getAllBookingIntoDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Bookings are Retrived Successfully',
        meta,
        data: result,
    });
}));
//getAll Booking
const getAllBookingToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    console.log("id: ", id);
    const { result, meta } = yield booking_Services_1.BookingServices.getAllBookingTokenIntoDB(req.query, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Bookings are Retrived Successfully',
        meta,
        data: result,
    });
}));
//getSingleBooking
const getSingleBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield booking_Services_1.BookingServices.getSingleBookingIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Booking Retrived Successfully',
        data: result,
    });
}));
//getAll PurchaseAdventurePack
const getAllPurchaseAdventurePack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, meta } = yield booking_Services_1.BookingServices.getAllPurchaseAdventurePackIntoDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'PurchaseAdventurePacks are Retrived Successfully',
        meta,
        data: result,
    });
}));
//create AdventurePack
const getTotalPurchaseAdventurePack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_Services_1.BookingServices.getTotalPurchaseAdventurePackIntoDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'AdventurePack retrived  Successfully',
        data: [result],
    });
}));
//getSingleBooking
const getSinglePurchaseAdventurePack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield booking_Services_1.BookingServices.getSinglePurchaseAdventurePackIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'PurchaseAdventurePack are Retrived Successfully',
        data: result,
    });
}));
//delete
const deleteBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield booking_Services_1.BookingServices.deleteBookingIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Booking Deleted Successfully',
        data: result,
    });
}));
//delete
const deletePurchaseAdventurePack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield booking_Services_1.BookingServices.deletePurchaseAdventurePackIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'PurchaseAdventurePack Deleted Successfully',
        data: result,
    });
}));
//inactive or active
const inActivePurchaseAdventurePack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield booking_Services_1.BookingServices.inActivePurchaseAdventurePackIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `${result === null || result === void 0 ? void 0 : result.status} PurchaseAdventurePack Successfully`,
        data: result,
    });
}));
//inactive or active booking
const inActiveOrActiveBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield booking_Services_1.BookingServices.inActiveBookingIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `${result === null || result === void 0 ? void 0 : result.status} Booking Successfully`,
        data: result,
    });
}));
//
const getAllSpecificBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield booking_Services_1.BookingServices.getAllSpecificBookingIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: ` Bookings, subscriptions and adventurePacks Retrived Successfully`,
        data: result,
    });
}));
exports.BookingContnrollers = {
    createBookingJetSky,
    purchaseAdventurePack,
    purchaseRentPack,
    getAllBooking,
    getSingleBooking,
    deleteBooking,
    getAllPurchaseAdventurePack,
    getSinglePurchaseAdventurePack,
    deletePurchaseAdventurePack,
    inActivePurchaseAdventurePack,
    inActiveOrActiveBooking,
    getTotalPurchaseAdventurePack,
    createBookingJetSkyByAdmin,
    getAllSpecificBooking,
    getAllBookingToken
};

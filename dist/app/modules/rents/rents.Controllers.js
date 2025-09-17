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
exports.rentControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const rents_services_1 = require("./rents.services");
//create Rent
const createRent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const result = yield rents_services_1.rentServices.createRentIntoDB(body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Rent Created Successfully',
        data: [result],
    });
}));
//getSingle Rent
const getSingleRent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield rents_services_1.rentServices.getSingleRentIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Rent Retrived Successfully',
        data: [result],
    });
}));
//getAll Rent
const getAllRent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, meta } = yield rents_services_1.rentServices.getAllRentIntoDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Rent are Retrived Successfully',
        meta,
        data: result
    });
}));
const getAvailableDatesForJetski = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.query;
    if (!date || isNaN(Date.parse(date))) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: "Invalid or missing date query parameter",
            data: null,
        });
    }
    const result = yield rents_services_1.rentServices.getAvailableDatesForJetskiIntoDB(new Date(date));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Available dates retrieved successfully",
        data: result,
    });
}));
const getAvailableDatesSpesificForJetski = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { model } = req.query;
    if (!model) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: "Missing model query parameter",
            data: null,
        });
    }
    const result = yield rents_services_1.rentServices.getAvailableDatesForSpesificJetskiIntoDB(model);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Available dates retrieved successfully",
        data: result,
    });
}));
//delete Rent
const deleteRent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield rents_services_1.rentServices.deleteRentIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Rent Deleted Successfully',
        data: result,
    });
}));
//updated Rent
const updateRent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield rents_services_1.rentServices.updateRentIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Rent Updated Successfully',
        data: result,
    });
}));
exports.rentControllers = {
    createRent,
    getSingleRent,
    getAllRent,
    updateRent,
    deleteRent,
    getAvailableDatesForJetski,
    getAvailableDatesSpesificForJetski,
};

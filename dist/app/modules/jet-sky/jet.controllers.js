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
exports.jetControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const jet_services_1 = require("./jet.services");
//create
const createJet = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    console.log(body, 'checking body data ==========>');
    const result = yield jet_services_1.jetServices.createJetIntoDB(body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Jet Created Successfully',
        data: [result],
    });
}));
//getSingle Jet
const getSingleJet = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield jet_services_1.jetServices.getSingleJetIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Jet Retrived Successfully',
        data: result,
    });
}));
//getAll Jet
const getAllJet = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, meta } = yield jet_services_1.jetServices.getAllJetIntoDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Jet are Retrived Successfully',
        meta,
        data: result
    });
}));
//delete Jet
const deleteJet = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield jet_services_1.jetServices.deleteJetIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Jet Deleted Successfully',
        data: result,
    });
}));
//getSingle Jet
const getSingleGallary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield jet_services_1.jetServices.getSingleGallaryIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Gallary Retrived Successfully',
        data: result,
    });
}));
//getAll Jet
const getAllGallery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield jet_services_1.jetServices.getAllGallaryIntoDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Gallary are Retrived Successfully',
        data: result
    });
}));
//delete Jet
const deleteGallary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield jet_services_1.jetServices.deleteGallarytoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Gallary Deleted Successfully',
        data: result,
    });
}));
//updated Jet
const updateJet = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield jet_services_1.jetServices.updateJetIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Jet Updated Successfully',
        data: result,
    });
}));
//create Gallary
const createGallary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("RequsetBody :P ", req.body);
    const result = yield jet_services_1.jetServices.createGallaryIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Gallary Created Successfully',
        data: result,
    });
}));
exports.jetControllers = {
    createJet,
    getSingleJet,
    getAllJet,
    updateJet,
    deleteJet,
    createGallary,
    getAllGallery,
    getSingleGallary,
    deleteGallary
};

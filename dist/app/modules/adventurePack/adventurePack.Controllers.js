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
exports.adventurePackControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const adventure_Services_1 = require("./adventure.Services");
//create AdventurePack
const createAdventurePack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const result = yield adventure_Services_1.AdventurePackServices.createAdventurePackIntoDB(body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'AdventurePack Created Successfully',
        data: [result],
    });
}));
//getSingle AdventurePack
const getSingleAdventurePack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield adventure_Services_1.AdventurePackServices.getSingleAdventurePackIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'AdventurePack Retrived Successfully',
        data: result,
    });
}));
//getAll AdventurePack
const getAllAdventurePack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, meta } = yield adventure_Services_1.AdventurePackServices.getAllAdventurePackIntoDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'AdventurePacks are Retrived Successfully',
        meta,
        data: result
    });
}));
//delete AdventurePack
const deleteAdventurePack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield adventure_Services_1.AdventurePackServices.deleteAdventurePackIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'AdventurePack Deleted Successfully',
        data: result,
    });
}));
//updated AdventurePack
const updateAdventurePack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield adventure_Services_1.AdventurePackServices.updateAdventurePackIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'AdventurePack Updated Successfully',
        data: result,
    });
}));
exports.adventurePackControllers = {
    createAdventurePack,
    getSingleAdventurePack,
    getAllAdventurePack,
    updateAdventurePack,
    deleteAdventurePack,
};

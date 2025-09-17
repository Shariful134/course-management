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
exports.memberShipServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const memberShip_model_1 = require("./memberShip.model");
// create memberShip
const createMemberShiipIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const duration = payload === null || payload === void 0 ? void 0 : payload.durationInMonths;
    let weekCount = 0;
    if (duration) {
        weekCount = Math.round(duration * 4.345);
    }
    console.log(weekCount);
    const payloads = Object.assign(Object.assign({}, payload), { weekCount });
    const result = yield memberShip_model_1.MemberShip.create(payloads);
    return result;
});
// Get Single memberShip
const getSingleMemberShipIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield memberShip_model_1.MemberShip.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'MemberShip is not Found!');
    }
    return result;
});
// Get All memberShip
const getAllMemberShipIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield memberShip_model_1.MemberShip.find();
    //checking memberShip is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'MemberShip is not Found!');
    }
    return result;
});
//Updated MemberShip
const updateMemberShipIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield memberShip_model_1.MemberShip.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'MemberShip is not Found!');
    }
    return result;
});
// Delete MemberShip
const deleteMemberShipIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield memberShip_model_1.MemberShip.findByIdAndDelete(id);
    //checking membership is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'MemberShip is not Found!');
    }
    return result;
});
exports.memberShipServices = {
    createMemberShiipIntoDB,
    getSingleMemberShipIntoDB,
    getAllMemberShipIntoDB,
    updateMemberShipIntoDB,
    deleteMemberShipIntoDB
};

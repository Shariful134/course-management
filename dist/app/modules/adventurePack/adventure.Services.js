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
exports.AdventurePackServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const adventurePack_model_1 = require("./adventurePack.model");
const jet_model_1 = require("../jet-sky/jet.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const adventurePack_Contanstant_1 = require("./adventurePack.Contanstant");
// create AdventurePack
const createAdventurePackIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const jet_sky = yield jet_model_1.JetSky.findById(payload.jet_skyId);
    if (!jet_sky) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet_Sky is not Found!');
    }
    const result = yield adventurePack_model_1.AdventurePack.create(payload);
    return result;
});
// Get Single AdventurePack
const getSingleAdventurePackIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adventurePack_model_1.AdventurePack.findById(id).populate("jet_skyId");
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'AdventurePack is not Found!');
    }
    return result;
});
// Get All AdventurePack
const getAllAdventurePackIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const adventurePack = new QueryBuilder_1.default(adventurePack_model_1.AdventurePack.find().populate("jet_skyId"), query).search(adventurePack_Contanstant_1.adventurePackSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield adventurePack.modelQuery;
    const meta = yield adventurePack.countTotal();
    //checking user is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User is not Found!');
    }
    return { result, meta };
});
//Updated AdventurePack
const updateAdventurePackIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload === null || payload === void 0 ? void 0 : payload.jet_skyId) {
        const jet_sky = yield jet_model_1.JetSky.findById(payload === null || payload === void 0 ? void 0 : payload.jet_skyId);
        if (!jet_sky) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet_Sky is not Found!');
        }
    }
    const result = yield adventurePack_model_1.AdventurePack.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'AdventurePack is not Found!');
    }
    return result;
});
// Delete AdventurePack
const deleteAdventurePackIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adventurePack_model_1.AdventurePack.findByIdAndDelete(id);
    //checking AdventurePack is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'AdventurePack is not Found!');
    }
    return result;
});
exports.AdventurePackServices = {
    createAdventurePackIntoDB,
    getSingleAdventurePackIntoDB,
    getAllAdventurePackIntoDB,
    updateAdventurePackIntoDB,
    deleteAdventurePackIntoDB,
};

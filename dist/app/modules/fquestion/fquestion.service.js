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
exports.fquestionServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const fquestion_model_1 = require("./fquestion.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
// Searchable fields
const fquestionSearchableFields = ["question", "answare"];
// Create Fquestion
const createFquestionIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fquestion_model_1.Fquestion.create(payload);
    return result;
});
// Get Single Fquestion
const getSingleFquestionIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fquestion_model_1.Fquestion.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Fquestion is not Found!");
    }
    return result;
});
// Get All Fquestion
const getAllFquestionIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const fquestionQuery = new QueryBuilder_1.default(fquestion_model_1.Fquestion.find(), query)
        .search(fquestionSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield fquestionQuery.modelQuery;
    const meta = yield fquestionQuery.countTotal();
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Fquestions are not Found!");
    }
    return { result, meta };
});
// Update Fquestion
const updateFquestionIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fquestion_model_1.Fquestion.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Fquestion is not Found!");
    }
    return result;
});
// Delete Fquestion
const deleteFquestionIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield fquestion_model_1.Fquestion.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Fquestion is not Found!");
    }
    return result;
});
exports.fquestionServices = {
    createFquestionIntoDB,
    getSingleFquestionIntoDB,
    getAllFquestionIntoDB,
    updateFquestionIntoDB,
    deleteFquestionIntoDB,
};

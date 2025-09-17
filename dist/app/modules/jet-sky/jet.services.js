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
exports.jetServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const jet_model_1 = require("./jet.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const jet_constant_1 = require("./jet.constant");
// create Jet
const createJetIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield jet_model_1.JetSky.create(payload);
    return result;
});
// Get Single Jet
const getSingleJetIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield jet_model_1.JetSky.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet is not Found!');
    }
    return result;
});
// const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
//   const facultyQuery = new QueryBuilder(
//     Faculty.find().populate('academicDepartment'),
//     query,
//   )
//     .search(FacultySearchableFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();
//   const result = await facultyQuery.modelQuery;
//   return result;
// };
// Get All Jet
const getAllJetIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const jet_SkyQuery = new QueryBuilder_1.default(jet_model_1.JetSky.find(), query).search(jet_constant_1.jetSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield jet_SkyQuery.modelQuery;
    const meta = yield jet_SkyQuery.countTotal();
    //checking jet is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet is not Found!');
    }
    return { result, meta };
});
//Updated Jet
const updateJetIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield jet_model_1.JetSky.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet is not Found!');
    }
    return result;
});
// Delete Jet
const deleteJetIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield jet_model_1.JetSky.findByIdAndDelete(id);
    //checking user is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet is not Found!');
    }
    return result;
});
const getAllGallaryIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield jet_model_1.Gallary.find();
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Gallary is not Found!');
    }
    return result;
});
//GetSingle Jet
const getSingleGallaryIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield jet_model_1.Gallary.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Gallary is not Found!');
    }
    return result;
});
// Delete Jet
const deleteGallarytoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield jet_model_1.Gallary.findByIdAndDelete(id);
    //checking 
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Gallary is not Found!');
    }
    return result;
});
// Create Gallary
const createGallaryIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield jet_model_1.Gallary.create(payload);
    return result;
});
exports.jetServices = {
    createJetIntoDB,
    getSingleJetIntoDB,
    getAllJetIntoDB,
    updateJetIntoDB,
    deleteJetIntoDB,
    createGallaryIntoDB,
    getAllGallaryIntoDB,
    getSingleGallaryIntoDB,
    deleteGallarytoDB,
};

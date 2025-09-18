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
exports.courseServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const course_model_1 = __importDefault(require("./course.model"));
const auth_model_1 = require("../auth/auth.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const SearchableFields = ["description", "title", "category"];
// Create Course (Admin)
const createCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const instructor = yield auth_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.instructor);
    if (!instructor) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Instructor is not found!");
    }
    // Check if the user has role 'instructor'
    if (instructor.role !== "instructor") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "User is not an instructor!");
    }
    const course = yield course_model_1.default.create(payload);
    return course;
});
// Update Course (Admin)
const updateCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedCourse = yield course_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!updatedCourse)
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Course not found!");
    return updatedCourse;
});
// Delete Course (Admin)
const deleteCourseIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedCourse = yield course_model_1.default.findByIdAndDelete(id);
    if (!deletedCourse)
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Course not found!");
    return deletedCourse;
});
// Get All Courses
const getAllCoursesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const course = new QueryBuilder_1.default(course_model_1.default.find().populate("instructor"), query)
        .search(SearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield course.modelQuery;
    const meta = yield course.countTotal();
    return { result, meta };
});
// Get Single Course
const getSingleCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.default.findById(id).populate("instructor", "name email role");
    if (!course)
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Course not found!");
    return course;
});
// Get Popular Courses
const getPopularCoursesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield course_model_1.default.find({ isPopular: true }).populate("instructor", "name email role");
    return courses;
});
exports.courseServices = {
    createCourseIntoDB,
    updateCourseIntoDB,
    deleteCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    getPopularCoursesFromDB,
};

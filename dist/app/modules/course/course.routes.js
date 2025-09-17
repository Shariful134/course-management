"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const ValidateRequest_1 = __importDefault(require("../../../middlewares/ValidateRequest"));
const course_validation_1 = require("./course.validation");
const course_controllers_1 = require("./course.controllers");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)("admin"), (0, ValidateRequest_1.default)(course_validation_1.courseValidation.createCourseSchema), course_controllers_1.courseControllers.createCourse);
router.put("/:id", (0, auth_1.default)("admin"), (0, ValidateRequest_1.default)(course_validation_1.courseValidation.updateCourseSchema), course_controllers_1.courseControllers.updateCourse);
router.delete("/:id", (0, auth_1.default)("admin"), course_controllers_1.courseControllers.deleteCourse);
router.get("/", course_controllers_1.courseControllers.getAllCourses);
router.get("/popular", course_controllers_1.courseControllers.getPopularCourses);
router.get("/:id", course_controllers_1.courseControllers.getSingleCourse);
exports.courseRoutes = router;

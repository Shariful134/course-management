"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_validation_1 = require("./auth.validation");
const auth_controllers_1 = require("./auth.controllers");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const ValidateRequest_1 = __importDefault(require("../../../middlewares/ValidateRequest"));
const router = express_1.default.Router();
// User register
router.post("/register-user", (0, ValidateRequest_1.default)(auth_validation_1.authValidation.userRegisterSchema), auth_controllers_1.authControllers.registerUser);
// User login
router.post("/login", (0, ValidateRequest_1.default)(auth_validation_1.authValidation.loginValidationschema), auth_controllers_1.authControllers.loginUser);
// Logout Route
router.post("/logout", auth_controllers_1.authControllers.logoutUser);
// getAll User
router.get("/get", auth_controllers_1.authControllers.getAllUser);
// getSingle User
router.get("/get/:id", auth_controllers_1.authControllers.getSingleUser);
// getAll User with administrator and without admin
router.get("/getAll/user/total", auth_controllers_1.authControllers.getTotalCountUser);
// delete User
router.delete("/delete/user/:id", (0, auth_1.default)("admin"), auth_controllers_1.authControllers.deleteUser);
exports.AuthRoutes = router;

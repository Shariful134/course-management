"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fquestionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const ValidateRequest_1 = __importDefault(require("../../../middlewares/ValidateRequest"));
const fquestion_validation_1 = require("./fquestion.validation");
const fquestion_controllers_1 = require("./fquestion.controllers");
const router = express_1.default.Router();
// Create Fquestion (only Admin / Administrator)
router.post("/create", (0, auth_1.default)("Admin", "Administrator"), (0, ValidateRequest_1.default)(fquestion_validation_1.fquestionValidation.fquestionCreateSchema), fquestion_controllers_1.fquestionControllers.createFquestion);
// Get Single
router.get("/get/:id", fquestion_controllers_1.fquestionControllers.getSingleFquestion);
// Get All
router.get("/get", fquestion_controllers_1.fquestionControllers.getAllFquestion);
// Update
router.patch("/update/:id", (0, auth_1.default)("Admin", "Administrator"), (0, ValidateRequest_1.default)(fquestion_validation_1.fquestionValidation.fquestionUpdateSchema), fquestion_controllers_1.fquestionControllers.updateFquestion);
// Delete
router.delete("/delete/:id", (0, auth_1.default)("Admin", "Administrator"), fquestion_controllers_1.fquestionControllers.deleteFquestion);
exports.fquestionRoutes = router;

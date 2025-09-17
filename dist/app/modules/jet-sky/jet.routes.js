"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jetRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const ValidateRequest_1 = __importDefault(require("../../../middlewares/ValidateRequest"));
const jet_validation_1 = require("./jet.validation");
const jet_controllers_1 = require("./jet.controllers");
// import { upload } from "../../../middlewares/upload.middleware";
const attachedFiletoBody_1 = __importDefault(require("../../../middlewares/attachedFiletoBody"));
const upload_1 = require("../../../utils/upload");
const router = express_1.default.Router();
// create Jet
router.post("/create", upload_1.upload.array("image"), attachedFiletoBody_1.default, (0, auth_1.default)("Admin", "Administrator"), (0, ValidateRequest_1.default)(jet_validation_1.jetSkyValidation.jetSkyCreateSchema), jet_controllers_1.jetControllers.createJet);
// getSingle Jet
router.get("/get/:id", jet_controllers_1.jetControllers.getSingleJet);
// get All Jet
router.get("/get", jet_controllers_1.jetControllers.getAllJet);
// update Jet only admin and administrator
router.patch("/update/:id", upload_1.upload.array("image"), attachedFiletoBody_1.default, (0, auth_1.default)("Admin", "Administrator"), (0, ValidateRequest_1.default)(jet_validation_1.jetSkyValidation.jetSkyUpdateSchema), jet_controllers_1.jetControllers.updateJet);
// delete jet
router.delete("/delete/:id", (0, auth_1.default)("Admin", "Administrator"), jet_controllers_1.jetControllers.deleteJet);
// =========================create Gallary=================================
router.post("/create/gallary", upload_1.upload.array("image"), attachedFiletoBody_1.default, (0, auth_1.default)("Admin", "Administrator"), jet_controllers_1.jetControllers.createGallary);
router.get("/gallary/get", jet_controllers_1.jetControllers.getAllGallery);
// getSingle Jet
router.get("/gallary/:id", jet_controllers_1.jetControllers.getSingleGallary);
// Delete
router.delete("/gallary/delete/:id", jet_controllers_1.jetControllers.deleteGallary);
exports.jetRoutes = router;

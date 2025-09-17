"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberShipRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const ValidateRequest_1 = __importDefault(require("../../../middlewares/ValidateRequest"));
const memberShip_validation_1 = require("./memberShip.validation");
const memberShip_controllers_1 = require("./memberShip.controllers");
const router = express_1.default.Router();
// create MemberShip
router.post("/create", (0, auth_1.default)("Admin", "Administrator"), (0, ValidateRequest_1.default)(memberShip_validation_1.memberShipValidation.memberShipCreateSchema), memberShip_controllers_1.memberShipControllers.createMemberShip);
// getSingle MemberShip
router.get("/get/:id", memberShip_controllers_1.memberShipControllers.getSingleMemberShip);
// get All MemberShip
router.get("/get", memberShip_controllers_1.memberShipControllers.getAllMemberShip);
// update MemberShip only admin and administrator
router.patch("/update/:id", (0, auth_1.default)("Admin", "Administrator"), (0, ValidateRequest_1.default)(memberShip_validation_1.memberShipValidation.memberShipUpdateSchema), memberShip_controllers_1.memberShipControllers.updateMemberShip);
// delete MemberShip
router.delete("/delete/:id", (0, auth_1.default)("Admin", "Administrator"), memberShip_controllers_1.memberShipControllers.deleteMemberShip);
exports.memberShipRoutes = router;

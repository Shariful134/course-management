"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adventurePackRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const ValidateRequest_1 = __importDefault(require("../../../middlewares/ValidateRequest"));
const adventure_Validation_1 = require("./adventure.Validation");
const adventurePack_Controllers_1 = require("./adventurePack.Controllers");
const router = express_1.default.Router();
// create AdventurePack
router.post("/create", (0, auth_1.default)("Admin", "Administrator"), (0, ValidateRequest_1.default)(adventure_Validation_1.adventurePackValidation.adventurePackCreateSchema), adventurePack_Controllers_1.adventurePackControllers.createAdventurePack);
// getSingle AdventurePack
router.get("/get/:id", adventurePack_Controllers_1.adventurePackControllers.getSingleAdventurePack);
// get All AdventurePack
router.get("/get", adventurePack_Controllers_1.adventurePackControllers.getAllAdventurePack);
// update AdventurePack only admin and administrator
router.patch("/update/:id", (0, auth_1.default)("Admin", "Administrator"), (0, ValidateRequest_1.default)(adventure_Validation_1.adventurePackValidation.adventurePackUpdateSchema), adventurePack_Controllers_1.adventurePackControllers.updateAdventurePack);
// delete AdventurePack
router.delete("/delete/:id", (0, auth_1.default)("Admin", "Administrator"), adventurePack_Controllers_1.adventurePackControllers.deleteAdventurePack);
exports.adventurePackRoutes = router;

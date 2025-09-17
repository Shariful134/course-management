"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.successStoryRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const ValidateRequest_1 = __importDefault(require("../../../middlewares/ValidateRequest"));
const succes_validtion_1 = require("./succes.validtion");
const success_controllers_1 = require("./success.controllers");
const router = (0, express_1.Router)();
// Admin Only: Add Story
router.post("/", (0, auth_1.default)("admin"), (0, ValidateRequest_1.default)(succes_validtion_1.successStoryValidation.createStorySchema), success_controllers_1.successStoryControllers.createStory);
// Public: Get All Stories
router.get("/", success_controllers_1.successStoryControllers.getAllStories);
exports.successStoryRoutes = router;

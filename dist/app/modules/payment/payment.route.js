"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoute = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post("/create-pakage", (0, auth_1.default)("Admin", "Administrator", "User"), payment_controller_1.paymentController.createCheckoutSession);
router.get("/get", payment_controller_1.paymentController.getPayment);
exports.paymentRoute = router;

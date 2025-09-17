"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionShipRoutes = void 0;
const express_1 = __importDefault(require("express"));
const subscription_Controllers_1 = require("./subscription.Controllers");
const auth_1 = __importDefault(require("../../../../middlewares/auth"));
const router = express_1.default.Router();
// getSingle subscription
//cancel subscriptions 
router.post("/cancel", (0, auth_1.default)("User"), subscription_Controllers_1.subscriptionControllers.cancelSubscription);
router.get("/get/:id", subscription_Controllers_1.subscriptionControllers.getSingleSubscription);
// get All subscription
router.get("/get", subscription_Controllers_1.subscriptionControllers.getAllSubscription);
// get All subscription
router.get("/delete/:id", subscription_Controllers_1.subscriptionControllers.deleteSubscription);
// get Total  subscription in current month
router.get("/total/", subscription_Controllers_1.subscriptionControllers.getTotalSubscription);
// Inactiveted or activeted  PurchaseSubscription
router.patch("/inActiveOrActive/:id", (0, auth_1.default)("Admin", "Administrator"), subscription_Controllers_1.subscriptionControllers.inActiveOrActiveSubscription);
// Updated RemaingCredits PurchaseSubscription
router.patch("/remaingCreditsUpdate/", (0, auth_1.default)("Admin", "Administrator"), subscription_Controllers_1.subscriptionControllers.increaseremainingCreditsSubscription);
router.patch("/remaingCreditsUpdate/:id", (0, auth_1.default)("Admin", "Administrator"), subscription_Controllers_1.subscriptionControllers.spesificRemainingCreditsSubscription);
exports.subscriptionShipRoutes = router;

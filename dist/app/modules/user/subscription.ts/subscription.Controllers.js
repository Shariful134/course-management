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
exports.subscriptionControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../../shared/sendResponse"));
const subscription_Services_1 = require("./subscription.Services");
// create subscription
const createSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_Services_1.subscriptionServices.createSubscriptionIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Your Subscription Created Successfully",
        data: [result],
    });
}));
//cancel subscriptions 
const cancelSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_Services_1.subscriptionServices.cancelSubscriptionIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Your Subscription has been canceled successfully",
        data: result,
    });
}));
const getSingleSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield subscription_Services_1.subscriptionServices.getSingleSubscriptionIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Subsribtion Retirived Successfully",
        data: [result],
    });
}));
const getAllSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, meta } = yield subscription_Services_1.subscriptionServices.getAllSubscriptionIntoDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Subsribtion Retrieved Successfully",
        meta,
        data: result,
    });
}));
//get total booking current month
const getTotalSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_Services_1.subscriptionServices.getTotalSubscriptionIntoDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Subsribtion Retrieved Successfully",
        data: result,
    });
}));
//delete subscription
const deleteSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield subscription_Services_1.subscriptionServices.deleteSubscriptionIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: " Deleted Subsribtion Successfully",
        data: [result],
    });
}));
//inactive or active subscription
const inActiveOrActiveSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield subscription_Services_1.subscriptionServices.inActivePurchaseSubscriptionIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `${result === null || result === void 0 ? void 0 : result.status} Your Subscription Successfully`,
        data: result,
    });
}));
//updated
const increaseremainingCreditsSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_Services_1.subscriptionServices.increaseremainingCreditsSubscriptionIntoDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Your Subscription Updated Successfully`,
        data: result,
    });
}));
const spesificRemainingCreditsSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield subscription_Services_1.subscriptionServices.spesificRemainingCreditsSubscriptionIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `${result === null || result === void 0 ? void 0 : result.status} Your Subscription Updated Successfully`,
        data: result,
    });
}));
exports.subscriptionControllers = {
    createSubscription,
    getSingleSubscription,
    getAllSubscription,
    deleteSubscription,
    cancelSubscription,
    getTotalSubscription,
    inActiveOrActiveSubscription,
    increaseremainingCreditsSubscription,
    spesificRemainingCreditsSubscription
    // getSuccessSubscription,
    // getPortalSubscription,
};

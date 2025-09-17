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
exports.paymentController = void 0;
const payment_service_1 = require("./payment.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const payload = req.body;
        const isAdmin = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "Admin";
        const result = yield payment_service_1.paymentServices.createCheckoutSessionPayment(req, payload, isAdmin);
        res.status(200).json(Object.assign({ success: true }, result));
    }
    catch (error) {
        console.error("❌ Error creating checkout session:", error.message);
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to create checkout session",
        });
        // res.status(500).json({
        //   success: false,
        //   message: "Failed to create checkout session",
        //   error: error.message,
        // });
    }
});
// const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
//   // const isAdmin = req.user?.role === "Admin";
//   const result = await paymentServices.createCheckoutSessionPayment(req);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Checkout session created successfully",
//     data: result,
//   });
// });
//   try {
// // if usre is admin then no limit of days
//     const result = await paymentServices.createCheckoutSessionPayment(req);
//     res.status(200).json({
//       success: true,
//       ...result,
//     });
//   } catch (error: any) {
//     console.error("❌ Error creating checkout session:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create checkout session",
//       error: error.message,
//     });
//   }
const getPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, meta } = yield payment_service_1.paymentServices.getPaymentIntoDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Payment Retrived Booking Successfully`,
        meta,
        data: result,
    });
}));
exports.paymentController = {
    createCheckoutSession,
    getPayment,
};

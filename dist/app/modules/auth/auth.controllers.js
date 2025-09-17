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
exports.authControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_services_1 = require("./auth.services");
const config_1 = __importDefault(require("../../../config"));
//register User
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.authServices.registerUserIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Registration Successfully",
        data: [result],
    });
}));
//login User
const loginUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.authServices.loginUserIntoDB(req.body);
    const { refreshToken, accessToken } = result;
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.node_env === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Login Successfully!",
        data: [accessToken],
    });
}));
//getSingle User
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield auth_services_1.authServices.getSingleUserIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User Retrived Successfully",
        data: result,
    });
}));
//getAll User
const getAllUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, meta } = yield auth_services_1.authServices.getAllUserIntoDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "All User Retrived Successfully",
        meta,
        data: result,
    });
}));
//getAll User
const getTotalCountUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.authServices.getTotalUserIntoDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "All User Retrived Successfully",
        data: result,
    });
}));
//getAll Administrator
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield auth_services_1.authServices.deleteUserIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "User Deleted Successfully",
        data: result,
    });
}));
exports.authControllers = {
    registerUser,
    loginUser,
    getSingleUser,
    getAllUser,
    deleteUser,
    getTotalCountUser,
};
// //verify email token
// const verifyEmail = catchAsync(async (req, res) => {
//   const { email, otp, fcmToken } = req.body;
//   const user = await authServices.verifyEmail(email, otp, fcmToken);
//   if (!user) {
//     throw new ApiError(400, "Invalid OTP");
//   }
//   res.cookie("token", user.token, { httpOnly: true });
//   res.status(200).json({
//     success: true,
//     message: "Email verified successfully!",
//     data: user,
//   });
// });
// // change password
// const changePassword = catchAsync(async (req, res) => {
//   const userToken = req.headers.authorization;
//   const { oldPassword, newPassword } = req.body;
//   const result = await authServices.changePassword(
//     userToken as string,
//     newPassword,
//     oldPassword
//   );
//   sendResponse(res, {
//     success: true,
//     statusCode: 201,
//     message: "Password changed successfully",
//     data: result,
//   });
// });
// // forgot password
// const forgotPassword = catchAsync(async (req, res) => {
//   const result = await authServices.forgotPassword(req.body);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Check your email!",
//     data: result,
//   });
// });
// //resend otp
// const resendOtp = catchAsync(async (req, res) => {
//   const result = await authServices.resendOtp(req.body.email);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Check your email!",
//     data: result,
//   });
// });
// //verify forgot password otp
// const verifyForgotPasswordOtp = catchAsync(
//   async (req, res) => {
//     const result = await authServices.verifyForgotPasswordOtp(req.body);
//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: "Now You Set Your New Password!",
//       data: result,
//     });
//   }
// );
// //reset password
// const resetPassword = catchAsync(async (req, res) => {
//   await authServices.resetPassword(req.body);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Password Reset!",
//     data: null,
//   });
// });
// //getSingle Administrator
// const getSingleAdministrator = catchAsync(async (req, res) => {
//   const { email } = req.params;
//   const result = await authServices.getSingleAdministratorIntoDB(email);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Administrator Retrived Successfully',
//     data: [result],
//   });
// });
// //getAll Trainer
// const getAllAdministrator = catchAsync(async (req, res) => {
//   const result = await authServices.getAllAdministratorIntoDB();
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'All Administrators Retrived Successfully',
//     data: result,
//   });
// });
// //getAll Administrator
// const deleteAdministrator = catchAsync(async (req, res) => {
//   const { email } = req.params;
//   const result = await authServices.deleteAdministratorIntoDB(email);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: 'Administrator Deleted Successfully',
//     data: result,
//   });
// });

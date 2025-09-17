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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const auth_model_1 = require("./auth.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const config_1 = __importDefault(require("../../../config"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const auth_constant_1 = require("./auth.constant");
//register User
const registerUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.isUserExistsByEmail(payload.email);
    if (user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Email Already Registered!");
    }
    const result = yield auth_model_1.User.create(Object.assign(Object.assign({}, payload), { role: "User" }));
    const _a = result.toObject(), { password } = _a, userData = __rest(_a, ["password"]);
    return userData;
});
// loggin user
const loginUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.isUserExistsByEmail(payload.email);
    //checking user is exists
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User is not found!");
    }
    //checking if the password is correct or uncorrect
    if (!(yield auth_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password))) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Password does not match!");
    }
    const jwtPayload = {
        id: user._id,
        userEmail: user.email,
        role: user.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "30d",
    });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_refresh_secret, {
        expiresIn: "30d",
    });
    return { accessToken, refreshToken };
});
// Get Single User
const getSingleUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is not Found!");
    }
    return result;
});
// count User this month
const getTotalUserIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.find();
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is not Found!");
    }
    // Get current date
    const now = new Date();
    // Start and end of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    // Count users registered this month
    const registeredUsersCount = yield auth_model_1.User.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
    return {
        registeredUsersThisMonth: registeredUsersCount,
    };
});
// Get All User with administrator and without admin
const getAllUserIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new QueryBuilder_1.default(auth_model_1.User.find(), query)
        .search(auth_constant_1.userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield user.modelQuery;
    const meta = yield user.countTotal();
    //checking user is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is not Found!");
    }
    return { result, meta };
});
// Delete User
const deleteUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.findByIdAndDelete(id);
    //checking user is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User is not Found!");
    }
    return result;
});
// //Updated User
// const updateUserIntoDB = async (
//   id: string,
//   payload: Partial<IUser>,
//   req: Request
// ) => {
//   const user = await User.findById(id);
//   // checking user is exists
//   if (!user) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "User is not Found!");
//   }
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     throw new AppError(
//       StatusCodes.UNAUTHORIZED,
//       "Unauthorized - Token missing"
//     );
//   }
//   // if token is Bearer then do split
//   const token = authHeader.startsWith("Bearer ")
//     ? authHeader.split(" ")[1]
//     : authHeader;
//   const findUserEmail = user?.email;
//   let decoded;
//   try {
//     decoded = jwt.verify(
//       token,
//       config.jwt_access_secret as string
//     ) as CustomJwtPayload;
//   } catch (error) {
//     throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized");
//   }
//   const { userEmail, role, iat, exp } = decoded;
//   console.log(findUserEmail, userEmail);
//   if (findUserEmail?.toLowerCase().trim() !== userEmail?.toLowerCase().trim()) {
//     throw new AppError(StatusCodes.UNAUTHORIZED, "You are Unauthorized!");
//   }
//   if (req.body.images) {
//     payload.images = req.body.images;
//   }
//   if (payload.password) {
//     payload.password = await bcrypt.hash(
//       payload.password,
//       Number(config.bcrypt_salt_rounds)
//     );
//   }
//   // update user
//   const updatedUser = await User.findByIdAndUpdate(id, payload, {
//     new: true,
//   }).select("-password");
//   return updatedUser;
// };
// //Change Pasword
// const changePasswordIntoDB = async (
//   id: string,
//   payload: IChangePassword,
//   req: Request
// ) => {
//   const user = await User.findById(id).select("+password");
//   // checking user is exists
//   if (!user) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "User is not Found!");
//   }
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     throw new AppError(
//       StatusCodes.UNAUTHORIZED,
//       "Unauthorized - Token missing"
//     );
//   }
//   // if token is Bearer then do split
//   const token = authHeader.startsWith("Bearer ")
//     ? authHeader.split(" ")[1]
//     : authHeader;
//   const findUserEmail = user?.email;
//   let decoded;
//   try {
//     decoded = jwt.verify(
//       token,
//       config.jwt_access_secret as string
//     ) as CustomJwtPayload;
//   } catch (error) {
//     throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized");
//   }
//   const { userEmail, role, iat, exp } = decoded;
//   if (findUserEmail?.toLowerCase().trim() !== userEmail?.toLowerCase().trim()) {
//     throw new AppError(StatusCodes.UNAUTHORIZED, "You are Unauthorized!");
//   }
//   //checking if the password is correct or uncorrect
//   if (
//     !(await User.isPasswordMatched(payload.currentPassword, user?.password))
//   ) {
//     throw new AppError(
//       StatusCodes.UNAUTHORIZED,
//       "Current Password does not match!"
//     );
//   }
//   // const hashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));
//   // let hashedPassword
//   // if (user.password === payload.newPassword) {
//   //   hashedPassword = await bcrypt.hash(payload.currentPassword, Number(config.bcrypt_salt_rounds));
//   // }
//   // console.log(hashedPassword)
//   // update user
//   user.password = payload?.newPassword;
//   await user.save();
//   // const updatedUser = await User.findByIdAndUpdate(id, {password:hashedPassword}, { new: true }).select('-password');
//   return { email: user?.email, message: "Password Changed Successfuylly" };
// };
// // Azhar
// const forgotPassword = async (email: string) => {
//   const user = await User.findOne({ email }).select(
//     "+resetPasswordOtp +resetPasswordExpiry"
//   );
//   console.log(user);
//   if (!user) {
//     throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
//   }
//   // Generate 6-digit OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   // Save OTP + Expiry in DB
//   user.resetPasswordOtp = otp;
//   user.resetPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
//   await user.save();
//   // ✅ Send OTP via Email
//   await emailSender(
//     user.email, // 🔥 এখানে user.email হবে, user.userEmail না
//     "Password Reset OTP",
//     await EmailTemplates.temp1(Number(otp)) // template এ OTP পাঠাও
//   );
//   return { email: user.email, message: "OTP sent to email" };
// };
// // Azhar Mahmud
// // verify otp
// const verifyOtp = async (email: string, otp: string) => {
//   const user = await User.findOne({ email }).select(
//     "+resetPasswordOtp +resetPasswordExpiry"
//   );
//   if (!user) {
//     throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
//   }
//   if (
//     user.resetPasswordOtp !== otp ||
//     !user.resetPasswordExpiry ||
//     user.resetPasswordExpiry < new Date()
//   ) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "Invalid or expired OTP!");
//   }
//   return { email: user.email, message: "OTP verified successfully" };
// };
// // Azhar Mahmud
// // resetPassword service
// const resetPassword = async (
//   email: string,
//   otp: string,
//   newPassword: string
// ) => {
//   if (!newPassword) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "New password is required!");
//   }
//   const user = await User.findOne({ email }).select(
//     "+resetPasswordOtp +resetPasswordExpiry +password"
//   );
//   if (!user) {
//     throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
//   }
//   // OTP check
//   if (
//     user.resetPasswordOtp !== otp ||
//     !user.resetPasswordExpiry ||
//     user.resetPasswordExpiry < new Date()
//   ) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "Invalid or expired OTP!");
//   }
//   user.password = newPassword;
//   user.resetPasswordOtp = undefined;
//   user.resetPasswordExpiry = undefined;
//   await user.save();
//   user.password = newPassword;
//   return { email: user.email, message: "Password reset successful" };
// };
exports.authServices = {
    registerUserIntoDB,
    loginUserIntoDB,
    getAllUserIntoDB,
    getSingleUserIntoDB,
    deleteUserIntoDB,
    getTotalUserIntoDB,
};

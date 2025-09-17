import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { User } from "./auth.model";

import jwt from "jsonwebtoken";
import AppError from "../../../errors/AppError";
import { IUser, TUserLogin } from "./auth.interface";
import config from "../../../config";
import { CustomJwtPayload } from "../../../interface";
import { Request } from "express";
import QueryBuilder from "../../builder/QueryBuilder";
import { IChangePassword, userSearchableFields } from "./auth.constant";
import emailSender from "./emailSender";
import { EmailTemplates } from "./emailTemplate";

//register User
const registerUserIntoDB = async (payload: IUser) => {
  const user = await User.isUserExistsByEmail(payload.email);
  if (user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email Already Registered!");
  }
  const result = await User.create(payload);
  const { password, ...userData } = result.toObject();

  return userData;
};

// loggin user
const loginUserIntoDB = async (payload: TUserLogin) => {
  const user = await User.isUserExistsByEmail(payload.email);

  //checking user is exists
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User is not found!");
  }

  //checking if the password is correct or uncorrect
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Password does not match!");
  }

  const jwtPayload = {
    id: user._id,
    userEmail: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "30d",
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: "30d",
    }
  );

  return { accessToken, refreshToken };
};

// Get Single User
const getSingleUserIntoDB = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not Found!");
  }
  return result;
};

// count User this month
const getTotalUserIntoDB = async () => {
  const result = await User.find();
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not Found!");
  }

  // Get current date
  const now = new Date();

  // Start and end of current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  // Count users registered this month
  const registeredUsersCount = await User.countDocuments({
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  });

  return {
    registeredUsersThisMonth: registeredUsersCount,
  };
};

// Get All User with administrator and without admin
const getAllUserIntoDB = async (query: Record<string, unknown>) => {
  const user = new QueryBuilder(User.find(), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await user.modelQuery;
  const meta = await user.countTotal();

  //checking user is exists
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not Found!");
  }
  return { result, meta };
};

// Delete User
const deleteUserIntoDB = async (id: string) => {
  const result = await User.findByIdAndDelete(id);

  //checking user is exists
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not Found!");
  }

  return result;
};

export const authServices = {
  registerUserIntoDB,
  loginUserIntoDB,
  getAllUserIntoDB,
  getSingleUserIntoDB,
  deleteUserIntoDB,
  getTotalUserIntoDB,
};

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

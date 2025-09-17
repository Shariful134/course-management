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
exports.subscriptionServices = void 0;
const AppError_1 = __importDefault(require("../../../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const memberShip_model_1 = require("../../memberShip/memberShip.model");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const subscription_Model_1 = require("./subscription.Model");
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const subscriptionField_1 = require("./subscriptionField");
const auth_model_1 = require("../../auth/auth.model");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
//   ServerApiVersion: ""
});
// create Subscription
const createSubscriptionIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const memberShipData = yield memberShip_model_1.MemberShip.findById((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.memberShipPlanId);
    // console.log("memberShipData: ", memberShipData)
    const priceAmount = Number(memberShipData === null || memberShipData === void 0 ? void 0 : memberShipData.signUpFee) + Number(memberShipData === null || memberShipData === void 0 ? void 0 : memberShipData.refundableDeposit);
    if (!memberShipData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "MemberShip is not found!");
    }
    const plan = req.query.planId;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized - Token missing");
    }
    // if token is Bearer then do split 
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
    // decoded the token
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }
    console.log("decoded: ", decoded);
    console.log("memberShipData: ", memberShipData);
    // const subscriptionData = MemberShip.findById(req.params.id);
    const userData = yield auth_model_1.User.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id);
    const subscriptionFind = userData === null || userData === void 0 ? void 0 : userData.subscriptionPurchaseId;
    if (subscriptionFind === null || subscriptionFind === void 0 ? void 0 : subscriptionFind.length) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You Have allready purchase SubscriptionPack ');
    }
    // const subscription = req.query.subscriptionData;
    const subscriptionData = {
        userId: decoded === null || decoded === void 0 ? void 0 : decoded.id,
        memberShipPlanId: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.memberShipPlanId,
        userEmail: decoded === null || decoded === void 0 ? void 0 : decoded.userEmail,
        usreRole: decoded === null || decoded === void 0 ? void 0 : decoded.role,
        durationInMonths: memberShipData === null || memberShipData === void 0 ? void 0 : memberShipData.durationInMonths,
        signUpFeePaid: memberShipData === null || memberShipData === void 0 ? void 0 : memberShipData.signUpFee,
        refundableDepositPaid: memberShipData === null || memberShipData === void 0 ? void 0 : memberShipData.refundableDeposit,
        weeklyCharge: memberShipData === null || memberShipData === void 0 ? void 0 : memberShipData.price,
        planName: "pro",
        price: `${memberShipData === null || memberShipData === void 0 ? void 0 : memberShipData.price}`,
        currency: "USD",
        interval: "monthy",
        featuresList: ["Feature 1", "Feature 2", "Feature 3"],
        planId: memberShipData === null || memberShipData === void 0 ? void 0 : memberShipData.planId,
        intervalCount: 1
    };
    // const user = {
    //    email: "masdfsdf@gmail.com",
    //    customerId: "cus_LzYwMj9dM2mK2s"
    // }
    const session = yield stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: memberShipData === null || memberShipData === void 0 ? void 0 : memberShipData.planId,
                quantity: subscriptionData.intervalCount,
            },
            {
                // একবারের signUpFee ($2000)
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Sign-up Fee",
                    },
                    unit_amount: Number(memberShipData === null || memberShipData === void 0 ? void 0 : memberShipData.signUpFee) * 100, // Stripe amounts are in cents
                },
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: "http://localhost:3000/subscription/success",
        cancel_url: "http://localhost:3000/subscription/cancel",
        customer_email: decoded === null || decoded === void 0 ? void 0 : decoded.userEmail,
        subscription_data: {
            metadata: {
                userId: decoded.id,
                memberShipPlanId: req.body.memberShipPlanId,
                planId: subscriptionData.planId,
                planName: subscriptionData.planName,
                price: subscriptionData.price,
                durationInMonths: subscriptionData.durationInMonths,
                signUpFeePaid: subscriptionData.signUpFeePaid,
                refundableDepositPaid: subscriptionData.refundableDepositPaid,
                currency: subscriptionData.currency,
                interval: 24
            }
        },
        metadata: {
            userId: decoded === null || decoded === void 0 ? void 0 : decoded.id,
            memberShipPlanId: (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.memberShipPlanId,
            signUpFee: "2000",
            durationInMonths: subscriptionData.durationInMonths,
            planId: subscriptionData.planId,
            planName: subscriptionData.planName,
            price: subscriptionData.price,
            refundableDepositPaid: subscriptionData.refundableDepositPaid,
            currency: subscriptionData.currency,
            interval: subscriptionData.interval,
        }
    });
    // console.log(session)
    // console.log("metaData: ", session)
    return { url_Link: session.url };
});
//cancel subscriptions 
const cancelSubscriptionIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { stripeSubscriptionId } = req.body;
    if (!stripeSubscriptionId) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Subscription ID missing");
    }
    const canceledSubscription = yield stripe.subscriptions.update(stripeSubscriptionId, { cancel_at_period_end: false });
    const updatedSub = yield subscription_Model_1.Subscription.findOneAndUpdate({ stripeSubscriptionId: stripeSubscriptionId }, { status: "canceled", endDate: new Date(), remainingCredits: 0 }, { new: true });
    if (!updatedSub) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Subscription not found in DB!");
    }
    return {
        stripeData: canceledSubscription,
        dbData: updatedSub,
    };
});
// Get Single Subscription
const getSingleSubscriptionIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_Model_1.Subscription.findById(id).populate("membershipId").populate("userId");
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscription is not Found!');
    }
    return result;
});
// Get All Subscription
const getAllSubscriptionIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptonData = new QueryBuilder_1.default(subscription_Model_1.Subscription.find().populate("membershipId").populate("userId"), query).search(subscriptionField_1.subscriptionField)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield subscriptonData.modelQuery;
    const meta = yield subscriptonData.countTotal();
    // const result = await Subscription.find().populate("membershipId").populate("userId");
    //checking memberShip is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscription is not Found!');
    }
    return { result, meta };
});
// Get Total Subscription of Current Month
const getTotalSubscriptionIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get current date
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const subscriptionData = yield subscription_Model_1.Subscription.find({
        startDate: { $gte: startOfMonth, $lte: endOfMonth },
        status: "active",
    });
    const totalAmount = subscriptionData.reduce((acc, sub) => {
        return acc + (sub.signUpFeePaid ? sub.signUpFee : 0);
    }, 0);
    return {
        totalSubscriptions: subscriptionData.length,
        totalAmountInUSD: totalAmount,
    };
});
// delete Subscription
const deleteSubscriptionIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_Model_1.Subscription.findByIdAndDelete(id).populate("membershipId").populate("userId");
    //checking memberShip is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscription is not Found!');
    }
    return result;
});
//inActive SubscriptionPackIntoDB
const inActivePurchaseSubscriptionIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = (yield subscription_Model_1.Subscription.findById(id));
    //   const status = data?.status;
    const newStatus = (data === null || data === void 0 ? void 0 : data.status) === "active" ? "inActive" : "active";
    const result = yield subscription_Model_1.Subscription.findByIdAndUpdate(id, { status: newStatus }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Subscription not found!");
    }
    return result;
});
const increaseremainingCreditsSubscriptionIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscription_Model_1.Subscription.updateMany({ status: "active" }, { $set: { remainingCredits: 5 } });
    if (result.modifiedCount === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No active subscriptions found!");
    }
    return result;
});
const spesificRemainingCreditsSubscriptionIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = (yield subscription_Model_1.Subscription.findById(id));
    if ((data === null || data === void 0 ? void 0 : data.status) != "active") {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Subscription not active!");
    }
    const result = yield subscription_Model_1.Subscription.findByIdAndUpdate(id, { remainingCredits: 5 }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Subscription not updated!");
    }
    return result;
});
exports.subscriptionServices = {
    createSubscriptionIntoDB,
    getSingleSubscriptionIntoDB,
    getAllSubscriptionIntoDB,
    deleteSubscriptionIntoDB,
    cancelSubscriptionIntoDB,
    getTotalSubscriptionIntoDB,
    inActivePurchaseSubscriptionIntoDB,
    increaseremainingCreditsSubscriptionIntoDB,
    spesificRemainingCreditsSubscriptionIntoDB
};
// import { Request } from "express";
// import AppError from "../../../../errors/AppError";
// import { StatusCodes } from "http-status-codes";
// import { MemberShip } from "../../memberShip/memberShip.model";
// import Stripe from "stripe";
// import config from "../../../../config";
// import { CustomJwtPayload } from "../../../../interface";
// import jwt from 'jsonwebtoken';
// import { Subscription } from "./subscription.Model";
// type MembershipPlan = {
//     _id: string;
//     durationInMonths: number;
//     ridesPerMonth: number;
//     refundableDeposit: number;
//     signUpFee: number;
//     price: number;
//     planId: string;
//     description: string;
//     createdAt: Date;
//     updatedAt: Date;
//     __v: number;
// };
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//     //   ServerApiVersion: ""
// });
// // create Subscription
// const createSubscriptionIntoDB = async (req: Request) => {
//     const memberShipData = await MemberShip.findById(req?.body?.memberShipPlanId) as MembershipPlan
//     if (!memberShipData) {
//         throw new AppError(StatusCodes.BAD_REQUEST, "MemberShip is not found!");
//     }
//     const plan = req.query.planId;
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized - Token missing");
//     }
//     // if token is Bearer then do split
//     const token = authHeader.startsWith("Bearer ")
//         ? authHeader.split(" ")[1]
//         : authHeader;
//     // decoded the token
//     let decoded;
//     try {
//         decoded = jwt.verify(
//             token,
//             config.jwt_access_secret as string,
//         ) as CustomJwtPayload;
//     } catch (error) {
//         throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
//     }
//     // console.log("decoded: ", decoded)
//     // console.log("memberShipData: ", memberShipData)
//     // const subscriptionData = MemberShip.findById(req.params.id);
//     // const subscription = req.query.subscriptionData;
//     // const planMapping: Record<number, string> = {
//     //     24: config.planId_24 as string,
//     //     12: config.planId_12 as string,
//     //     6: config.planId_6 as string
//     // };
//     // const duration = memberShipData?.durationInMonths;
//     // const planId = planMapping[duration] || "default-plan";
//     // const test = Math.floor(
//     //   new Date().setMonth(new Date().getMonth() + duration) / 1000
//     // )
//     // console.log(test, "test:========>")
//     // console.log(planId, "PlanId:========>")
//     // memberShipData?.durationInMonths
//     const planId = memberShipData?.planId
//     console.log(memberShipData?.durationInMonths, "MemberShip durationInMonths:========>")
//     const subscriptionData = {
//         userId: decoded?.id,
//         memberShipPlanId: req?.body?.memberShipPlanId,
//         userEmail: decoded?.userEmail,
//         usreRole: decoded?.role,
//         planName: "pro",
//         price: `${memberShipData?.price}`,
//         currency: "USD",
//         interval: "monthy",
//         featuresList: ["Feature 1", "Feature 2", "Feature 3"],
//         planId: planId,
//         intervalCount: 1
//     }
//     // const user = {
//     //    email: "masdfsdf@gmail.com",
//     //    customerId: "cus_LzYwMj9dM2mK2s"
//     // }
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: [
//             {
//                 price: planId,
//                 quantity: 1,
//             },
//             {
//                 price_data: { // 👉 One-time 2000$ charge
//                     currency: "usd",
//                     product_data: {
//                         name: "Sign-up Fee",
//                     },
//                     unit_amount: 2000 * 100, // Stripe amounts are in cents
//                 },
//                 quantity: 1,
//             },
//         ],
//         mode: "subscription",
//         success_url: "http://localhost:3000/subscription/success",
//         cancel_url: "http://localhost:3000/subscription/cancel",
//         customer_email: decoded?.userEmail,
//         subscription_data: {
//             metadata: {
//                 planId: memberShipData?.planId,
//                 planName: subscriptionData.planName,
//                 price: subscriptionData.price,
//                 currency: subscriptionData.currency,
//                 interval: 24
//             }
//         },
//         metadata: {
//             userId: decoded?.id,
//             memberShipPlanId: req?.body?.memberShipPlanId,
//             planId: subscriptionData?.planId,
//             planName: subscriptionData?.planName,
//             price: memberShipData?.price.toString(),
//             currency: subscriptionData?.currency,
//             interval: memberShipData?.durationInMonths,
//         }
//     });
//     // console.log(session)
//     return { url_Link: session.url };
// };
// export const subscriptionServices = {
//     createSubscriptionIntoDB,
//     getSingleSubscriptionIntoDB,
//     getAllSubscriptionIntoDB,
//     // getSuccessSubscriptionIntoDB,
//     // getportalSubscriptionIntoDB
// };

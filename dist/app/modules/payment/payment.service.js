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
exports.paymentServices = void 0;
const config_1 = require("../../../config"); // must be initialized Stripe
const adventurePack_model_1 = require("../adventurePack/adventurePack.model");
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const rents_model_1 = require("../rents/rents.model");
const jet_model_1 = require("../jet-sky/jet.model");
const booking_Model_1 = require("../booking/booking.Model");
const auth_model_1 = require("../auth/auth.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const payment_model_1 = require("./payment.model");
const booking_contstant_1 = require("./booking.contstant");
const subscription_Model_1 = require("../user/subscription.ts/subscription.Model");
// stripe listen --forward-to http://localhost:5000/webhooks
//stripe open
//final code here
// const createCheckoutSessionPayment = async (
//   req: Request,
//   payload: Partial<IBooking>,
//   isAdmin: boolean = false
// ) => {
//   let subscriptionPurchaseData;
//   let adventurePurchaseData;
//   let startOfDay = new Date(payload.bookingDate as Date);
//   startOfDay.setHours(0, 0, 0, 0);
//   let endOfDay = new Date(payload.bookingDate as Date);
//   endOfDay.setHours(23, 59, 59, 999);
//   //purchaseData
//   subscriptionPurchaseData = (await Subscription.findOne({
//     userId: payload?.userId,
//     status: "active",
//     remainingCredits: { $gt: 0 },
//     createdAt: { $lte: endOfDay },
//     expiryDate: { $gte: startOfDay },
//   })) as any;
//   adventurePurchaseData = (await PurchaseAdventurePack.findOne({
//     userId: payload?.userId,
//     status: "active",
//     model: payload.model,
//     remainingCredits: { $gt: 0 },
//     createdAt: { $lte: endOfDay },
//     expiryDate: { $gte: startOfDay },
//   })) as any;
//   //   const payload = req.body
//   // const isAdmin = req.user?.role === "Admin";
// console.log("subscriptionPurchaseData: ", subscriptionPurchaseData)
//   // 0. User & Jet Ski Validation
//   const userData = (await User.findById(payload?.userId)) as any;
//   let rentPackData = (await Rent.findById(payload?.rentPackId).populate(
//     "jet_skyId"
//   )) as any;
//   if (!userData) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "User not found!");
//   }
//   // if (!rentPackData) {
//   //   throw new AppError(StatusCodes.BAD_REQUEST, "rentPack not found!");
//   // }
//   // ================New logic booking by AdventurePack & SubscriptionPack and purchase adventurePack=======================================
//   // booking with adventure  && subscriptions & ontime Payment
//   if (userData?.adventurePurchaseId.length != 0 && adventurePurchaseData) {
//     if (!adventurePurchaseData) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         `You can not book for${payload.model} model`
//       );
//     }
//     // console.log("adventurePurchaseData: ", adventurePurchaseData)
//     // . limit 14 days without (Admin)
//     let today = new Date();
//     today.setHours(0, 0, 0, 0);
//     let startDate = new Date(payload.bookingDate as Date);
//     startDate.setHours(0, 0, 0, 0);
//     const diffInDays = Math.ceil(
//       (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
//     );
//     if (!isAdmin && diffInDays > 14) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         "You can only book up to 14 days in advance!"
//       );
//     }
//     // 2. Availability check
//     const totalJetSkiesOfModel = await JetSky.countDocuments({
//       model: payload?.model,
//     });
//     const bookedCountData = await Booking.find({ bookingDate: payload?.bookingDate, model: payload?.model });
//     if (bookedCountData.length >= totalJetSkiesOfModel) {
//       throw new AppError(
//         StatusCodes.CONFLICT,
//         `Sorry, all ${payload.model} Jet Skis are already booked for this date!`
//       );
//     }
//     const bookingData = {
//       userId: payload.userId,
//       adventurePurchaseId: adventurePurchaseData?._id?.toString(),
//       price: 0,
//       totalPrice: 0,
//       bookingType: "adventurePack",
//       bookingDate: payload?.bookingDate
//         ? new Date(payload?.bookingDate)?.toISOString()
//         : "",
//       name: userData?.name,
//       email: userData?.email,
//       model: payload?.model,
//       jetSkyId: rentPackData?.jet_skyId?._id,
//       status: "active",
//       paymentStatus: "paid",
//     };
//     const bookingDone = await Booking.create(bookingData);
//     // if booking successfully save then upadate  remainging credits
//     if (bookingDone) {
//       userData.remainingCredits = (userData.remainingCredits ?? 0) - 1;
//       await userData.save();
//       adventurePurchaseData.remainingCredits =
//         (adventurePurchaseData.remainingCredits ?? 0) - 1;
//       await adventurePurchaseData.save();
//       return {
//         message: "Booking Successfull By AdventurePack",
//         bookingDone,
//       };
//     }
//   } else if (
//     userData?.subscriptionPurchaseId?.length != 0) {
//     // . limit 14 days without (Admin)
//     let today = new Date();
//     today.setHours(0, 0, 0, 0);
//     let startDate = new Date(payload.bookingDate as Date);
//     startDate.setHours(0, 0, 0, 0);
//     const diffInDays = Math.ceil(
//       (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
//     );
//     if (!isAdmin && diffInDays > 14) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         "You can only book up to 14 days in advance!"
//       );
//     }
//     // 2. Availability check
//     const totalJetSkiesOfModel = await JetSky.countDocuments({
//       model: payload?.model,
//     });
//     // console.log(rentPackData, "rentPackData")
//     const bookedCount = await Booking.countDocuments({
//       bookingDate: payload.bookingDate,
//       // status: 'active',
//       jetSkyId: {
//         $in: (await JetSky.find({ model: payload.model })).map((j) => j._id),
//       },
//     });
//     if (bookedCount >= totalJetSkiesOfModel) {
//       throw new AppError(
//         StatusCodes.CONFLICT,
//         `Sorry, all ${payload.model} Jet Skis are already booked for this date!`
//       );
//     }
//     const bookingData = {
//       userId: payload.userId,
//       subscriptionPurchaseId: subscriptionPurchaseData?._id?.toString(),
//       price: 2000,
//       totalPrice: subscriptionPurchaseData?.totalPrice || 0,
//       bookingType: "subscriptions",
//       bookingDate: payload?.bookingDate
//         ? new Date(payload?.bookingDate)?.toISOString()
//         : "",
//       name: userData?.name,
//       email: userData?.email,
//       model: payload?.model,
//       jetSkyId: rentPackData?.jet_skyId?._id,
//       status: "active",
//       paymentStatus: "paid",
//     };
//     // const createBooking at Database
//     const bookingDone = await Booking.create(bookingData);
//     // if booking successfully save then upadate  remainging credits
//     if (bookingDone) {
//       userData.remainingCredits = (userData.remainingCredits ?? 0) - 1;
//       await userData.save();
//       subscriptionPurchaseData.remainingCredits =
//         (subscriptionPurchaseData.remainingCredits ?? 0) - 1;
//       await subscriptionPurchaseData.save();
//       return {
//         message: "Booking Successfull By SubscriptionPack",
//         bookingDone,
//       };
//     }
//   } else if (payload?.adventurePackId) {
//     const adventurePackData = await AdventurePack.findById(
//       payload?.adventurePackId
//     ) as any;
//     if (!adventurePackData) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         "adventurePackData not found!"
//       );
//     }
//     const adventurePackTotalPrice =
//       Number(payload?.price) + Number(payload?.refundableDeposit);
//     let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
//     lineItems = [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "Adventure Pack",
//             description: "One-time Adventure Pack purchase",
//           },
//           unit_amount: Number(payload?.price || 0) * 100,
//         },
//         quantity: 1,
//       },
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "Refundable Deposit",
//             description: "Refundable security deposit",
//           },
//           unit_amount: Number(payload?.refundableDeposit || 0) * 100,
//         },
//         quantity: 1,
//       },
//     ];
//     const metadata: Record<string, string> = {
//       userId: payload?.userId?.toString() || "",
//       name: userData?.name as string,
//       email: userData?.email as string,
//       bookingType: "AdventurePack",
//       adventurePackId: payload?.adventurePackId
//         ? payload?.adventurePackId?.toString()
//         : "",
//       ridesNumber: payload?.ridesNumber?.toString() || "1",
//       bookingDate: payload?.bookingDate
//         ? new Date(payload?.bookingDate)?.toISOString()
//         : "",
//       model: payload?.model || "",
//       price: payload?.price?.toString() || "0",
//       refundableDepositPaid: payload?.refundableDeposit?.toString() || "0",
//       totalPrice: adventurePackTotalPrice.toString() || "0",
//     };
//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       line_items: lineItems,
//       success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
//       metadata,
//       locale: "en",
//     });
//     session.metadata;
//     return {
//       message: "Checkout session created for Purchase AdventurePack",
//       sessionUrl: session.url,
//     };
//   } else {
//     //here ontime bookin session create with ohter validation
//     // . limit 14 days without (Admin)
//     let today = new Date();
//     today.setHours(0, 0, 0, 0);
//     let startDate = new Date(payload.bookingDate as Date);
//     startDate.setHours(0, 0, 0, 0);
//     const diffInDays = Math.ceil(
//       (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
//     );
//     if (!isAdmin && diffInDays > 14) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         "You can only book up to 14 days in advance!"
//       );
//     }
//     // 2. Availability check
//     const totalJetSkiesOfModel = await JetSky.countDocuments({
//       model: payload?.model,
//     });
//     const bookedCountData = await Booking.find({ bookingDate: payload?.bookingDate });
//     console.log("bookedCountData: ", bookedCountData, "totalJetSkiesOfModel: ", totalJetSkiesOfModel)
//     if (bookedCountData.length >= totalJetSkiesOfModel) {
//       throw new AppError(
//         StatusCodes.CONFLICT,
//         `Sorry, all ${payload.model} Jet Skis are already booked for this date! RentPack`
//       );
//     }
//     const productName = "RentalPack";
//     const productDescription = "One-time RentalPack";
//     const metadata: Record<string, string> = {
//       userId: payload?.userId?.toString() || "",
//       name: userData?.name as string,
//       email: userData?.email as string,
//       bookingType: "RentPack",
//       rentPackId: payload?.rentPackId ? payload?.rentPackId?.toString() : "",
//       ridesNumber: payload?.ridesNumber?.toString() || "1",
//       bookingDate: payload?.bookingDate
//         ? new Date(payload?.bookingDate)?.toISOString()
//         : "",
//       model: payload?.model || "",
//       price: payload?.price?.toString() || rentPackData?.price?.toString() || "0",
//       totalPrice: payload?.price?.toString() || rentPackData?.price?.toString() || "0",
//     };
//     let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
//     lineItems = [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: productName,
//             description: productDescription,
//           },
//           unit_amount: Number(payload?.price || rentPackData?.price || 0) * 100,
//         },
//         quantity: 1,
//       },
//     ];
//     //created checkout sesison of
//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       line_items: lineItems,
//       success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
//       metadata,
//       locale: "en",
//     });
//     console.log("session.metadata: ", session.metadata);
//     return {
//       message: "Checkout session created successfully for RentPack Booking",
//       sessionUrl: session.url,
//     };
//   }
// };
const createCheckoutSessionPayment = (req_1, payload_1, ...args_1) => __awaiter(void 0, [req_1, payload_1, ...args_1], void 0, function* (req, payload, isAdmin = false) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    let subscriptionPurchaseData;
    let adventurePurchaseData;
    const startOfDay = new Date(payload.bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(payload.bookingDate);
    endOfDay.setHours(23, 59, 59, 999);
    // admin booking 
    // Fetch subscription & adventure purchase data if exists
    subscriptionPurchaseData = yield subscription_Model_1.Subscription.findOne({
        userId: payload === null || payload === void 0 ? void 0 : payload.userId,
        status: "active",
        remainingCredits: { $gt: 0 },
    });
    adventurePurchaseData = yield booking_Model_1.PurchaseAdventurePack.findOne({
        userId: payload === null || payload === void 0 ? void 0 : payload.userId,
        status: "active",
        model: payload.model,
        remainingCredits: { $gt: 0 },
        createdAt: { $lte: endOfDay },
        expiryDate: { $gte: startOfDay },
    });
    const userData = yield auth_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
    const rentPackData = yield rents_model_1.Rent.findById(payload === null || payload === void 0 ? void 0 : payload.rentPackId).populate("jet_skyId");
    if (!userData)
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found!");
    console.log("subscriptionPurchaseData: ", subscriptionPurchaseData);
    console.log("adventurePurchaseData: ", adventurePurchaseData);
    // ============ AdventurePack Booking ============
    if (payload === null || payload === void 0 ? void 0 : payload.adventurePackId) {
        const adventurePackData = yield adventurePack_model_1.AdventurePack.findById(payload.adventurePackId);
        if (!adventurePackData)
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "AdventurePack not found!");
        const adventurePackTotalPrice = Number(payload === null || payload === void 0 ? void 0 : payload.price) + Number(payload === null || payload === void 0 ? void 0 : payload.refundableDeposit);
        const lineItems = [
            {
                price_data: {
                    currency: "usd",
                    product_data: { name: "Adventure Pack", description: "One-time Adventure Pack purchase" },
                    unit_amount: Number((payload === null || payload === void 0 ? void 0 : payload.price) || 0) * 100,
                },
                quantity: 1,
            },
            {
                price_data: {
                    currency: "usd",
                    product_data: { name: "Refundable Deposit", description: "Refundable security deposit" },
                    unit_amount: Number((payload === null || payload === void 0 ? void 0 : payload.refundableDeposit) || 0) * 100,
                },
                quantity: 1,
            },
        ];
        const metadata = {
            userId: ((_a = payload === null || payload === void 0 ? void 0 : payload.userId) === null || _a === void 0 ? void 0 : _a.toString()) || "",
            name: (userData === null || userData === void 0 ? void 0 : userData.name) || "",
            email: (userData === null || userData === void 0 ? void 0 : userData.email) || "",
            bookingType: "AdventurePack",
            adventurePackId: ((_b = payload === null || payload === void 0 ? void 0 : payload.adventurePackId) === null || _b === void 0 ? void 0 : _b.toString()) || "",
            ridesNumber: ((_c = payload === null || payload === void 0 ? void 0 : payload.ridesNumber) === null || _c === void 0 ? void 0 : _c.toString()) || "1",
            bookingDate: (payload === null || payload === void 0 ? void 0 : payload.bookingDate) ? new Date(payload.bookingDate).toISOString() : "",
            model: (payload === null || payload === void 0 ? void 0 : payload.model) || "",
            price: ((_d = payload === null || payload === void 0 ? void 0 : payload.price) === null || _d === void 0 ? void 0 : _d.toString()) || "0",
            refundableDepositPaid: ((_e = payload === null || payload === void 0 ? void 0 : payload.refundableDeposit) === null || _e === void 0 ? void 0 : _e.toString()) || "0",
            totalPrice: adventurePackTotalPrice.toString(),
        };
        const session = yield config_1.stripe.checkout.sessions.create({
            mode: "payment",
            line_items: lineItems,
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
            metadata,
            locale: "en",
        });
        return { message: "Checkout session created for Purchase AdventurePack", sessionUrl: session.url };
    }
    else if (((_f = userData === null || userData === void 0 ? void 0 : userData.adventurePurchaseId) === null || _f === void 0 ? void 0 : _f.length) && adventurePurchaseData) {
        // Limit 14 days
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(payload.bookingDate);
        startDate.setHours(0, 0, 0, 0);
        const diffInDays = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (!isAdmin && diffInDays > 14) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You can only book up to 14 days in advance!");
        }
        // Availability check
        const totalJetSkiesOfModel = yield jet_model_1.JetSky.countDocuments({ model: payload === null || payload === void 0 ? void 0 : payload.model });
        const bookedCountData = yield booking_Model_1.Booking.find({ bookingDate: payload === null || payload === void 0 ? void 0 : payload.bookingDate, model: payload === null || payload === void 0 ? void 0 : payload.model });
        console.log("bookedCountData: ", bookedCountData);
        if (bookedCountData.length >= totalJetSkiesOfModel) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `Sorry, all ${payload.model} Jet Skis are already booked for this date!`);
        }
        const bookingData = {
            userId: payload.userId,
            adventurePurchaseId: (_g = adventurePurchaseData._id) === null || _g === void 0 ? void 0 : _g.toString(),
            price: 0,
            totalPrice: 0,
            bookingType: "adventurePack",
            bookingDate: startDate.toISOString(),
            bookingTime: payload === null || payload === void 0 ? void 0 : payload.bookingTime,
            name: userData === null || userData === void 0 ? void 0 : userData.name,
            email: userData === null || userData === void 0 ? void 0 : userData.email,
            model: payload === null || payload === void 0 ? void 0 : payload.model,
            jetSkyId: (_h = rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.jet_skyId) === null || _h === void 0 ? void 0 : _h._id,
            status: "active",
            paymentStatus: "paid",
        };
        const bookingDone = yield booking_Model_1.Booking.create(bookingData);
        if (bookingDone) {
            // Update remaining credits safely
            if (userData.remainingCredits !== undefined) {
                userData.remainingCredits = ((_j = userData.remainingCredits) !== null && _j !== void 0 ? _j : 0) - 1;
                yield userData.save();
            }
            if ((adventurePurchaseData === null || adventurePurchaseData === void 0 ? void 0 : adventurePurchaseData.remainingCredits) !== undefined) {
                adventurePurchaseData.remainingCredits = ((_k = adventurePurchaseData.remainingCredits) !== null && _k !== void 0 ? _k : 0) - 1;
                yield adventurePurchaseData.save();
            }
            return { message: "Booking Successful By AdventurePack", bookingDone };
        }
    }
    // ============ Subscription Booking ============
    else if (((_l = userData === null || userData === void 0 ? void 0 : userData.subscriptionPurchaseId) === null || _l === void 0 ? void 0 : _l.length) && subscriptionPurchaseData) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(payload.bookingDate);
        startDate.setHours(0, 0, 0, 0);
        const diffInDays = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (!isAdmin && diffInDays > 14) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You can only book up to 14 days in advance!");
        }
        const totalJetSkiesOfModel = yield jet_model_1.JetSky.countDocuments({ model: payload === null || payload === void 0 ? void 0 : payload.model });
        const bookedCount = yield booking_Model_1.Booking.countDocuments({
            bookingDate: payload.bookingDate,
            jetSkyId: { $in: (yield jet_model_1.JetSky.find({ model: payload.model })).map(j => j._id) },
        });
        if (bookedCount >= totalJetSkiesOfModel) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `Sorry, all ${payload.model} Jet Skis are already booked for this date!`);
        }
        const bookingData = {
            userId: payload.userId,
            subscriptionPurchaseId: (_m = subscriptionPurchaseData._id) === null || _m === void 0 ? void 0 : _m.toString(),
            price: 2000,
            totalPrice: 2000,
            bookingType: "subscriptions",
            bookingDate: startDate.toISOString(),
            bookingTime: payload === null || payload === void 0 ? void 0 : payload.bookingTime,
            name: userData === null || userData === void 0 ? void 0 : userData.name,
            email: userData === null || userData === void 0 ? void 0 : userData.email,
            model: payload === null || payload === void 0 ? void 0 : payload.model,
            jetSkyId: (_o = rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.jet_skyId) === null || _o === void 0 ? void 0 : _o._id,
            status: "active",
            paymentStatus: "paid",
        };
        const bookingDone = yield booking_Model_1.Booking.create(bookingData);
        if (bookingDone) {
            if (userData.remainingCredits !== undefined) {
                userData.remainingCredits = ((_p = userData.remainingCredits) !== null && _p !== void 0 ? _p : 0) - 1;
                yield userData.save();
            }
            if ((subscriptionPurchaseData === null || subscriptionPurchaseData === void 0 ? void 0 : subscriptionPurchaseData.remainingCredits) !== undefined) {
                subscriptionPurchaseData.remainingCredits = ((_q = subscriptionPurchaseData.remainingCredits) !== null && _q !== void 0 ? _q : 0) - 1;
                yield subscriptionPurchaseData.save();
            }
            return { message: "Booking Successful By SubscriptionPack", bookingDone };
        }
    }
    // ============ RentPack Booking (One-time Payment) ============
    else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(payload.bookingDate);
        startDate.setHours(0, 0, 0, 0);
        const diffInDays = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (!isAdmin && diffInDays > 14) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You can only book up to 14 days in advance!");
        }
        const totalJetSkiesOfModel = yield jet_model_1.JetSky.countDocuments({ model: payload === null || payload === void 0 ? void 0 : payload.model });
        const bookedCount = yield booking_Model_1.Booking.countDocuments({
            bookingDate: payload.bookingDate,
            jetSkyId: { $in: (yield jet_model_1.JetSky.find({ model: payload.model })).map(j => j._id) },
        });
        // const bookedCountData = await Booking.find({ bookingDate: payload?.bookingDate, model: payload?.model });
        if (bookedCount >= totalJetSkiesOfModel) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `Sorry, all ${payload.model} Jet Skis are already booked for this date! RentPack`);
        }
        if (isAdmin) {
            const bookingData = yield booking_Model_1.Booking.create({
                userId: payload === null || payload === void 0 ? void 0 : payload.userId,
                jetSkyId: payload.jetSkyId || undefined,
                rentPackId: ((_r = payload === null || payload === void 0 ? void 0 : payload.rentPackId) === null || _r === void 0 ? void 0 : _r.toString()) || "",
                type: "onetime",
                bookingDate: (payload === null || payload === void 0 ? void 0 : payload.bookingDate) ? new Date(payload.bookingDate) : "",
                maintenance: true,
                model: (payload === null || payload === void 0 ? void 0 : payload.model) || "",
                name: (userData === null || userData === void 0 ? void 0 : userData.name) || "",
                email: (userData === null || userData === void 0 ? void 0 : userData.email) || "",
                drivingLicense: payload === null || payload === void 0 ? void 0 : payload.drivingLicense,
                ridesNumber: ((_s = payload === null || payload === void 0 ? void 0 : payload.ridesNumber) === null || _s === void 0 ? void 0 : _s.toString()) || "1",
                price: (payload === null || payload === void 0 ? void 0 : payload.price) || (rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.price) || 0,
                totalPrice: (payload === null || payload === void 0 ? void 0 : payload.price) || (rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.price) || 0,
                stripePaymentIntentId: "",
                status: "active",
                paymentStatus: "paid",
                startDate,
            });
            if (bookingData) {
                // maintainanceDate push
                rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.bookingDate.push(payload.bookingDate);
                // saves
                yield (rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.save());
                return { message: "Booking Successfully done by Admin", data: bookingData };
            }
        }
        const metadata = {
            userId: ((_t = payload === null || payload === void 0 ? void 0 : payload.userId) === null || _t === void 0 ? void 0 : _t.toString()) || "",
            name: (userData === null || userData === void 0 ? void 0 : userData.name) || "",
            email: (userData === null || userData === void 0 ? void 0 : userData.email) || "",
            bookingType: "RentPack",
            rentPackId: ((_u = payload === null || payload === void 0 ? void 0 : payload.rentPackId) === null || _u === void 0 ? void 0 : _u.toString()) || "",
            ridesNumber: ((_v = payload === null || payload === void 0 ? void 0 : payload.ridesNumber) === null || _v === void 0 ? void 0 : _v.toString()) || "1",
            bookingDate: (payload === null || payload === void 0 ? void 0 : payload.bookingDate) ? new Date(payload.bookingDate).toISOString() : "",
            bookingTime: (payload === null || payload === void 0 ? void 0 : payload.bookingTime) || "",
            model: (payload === null || payload === void 0 ? void 0 : payload.model) || "",
            price: ((_w = payload === null || payload === void 0 ? void 0 : payload.price) === null || _w === void 0 ? void 0 : _w.toString()) || ((_x = rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.price) === null || _x === void 0 ? void 0 : _x.toString()) || "0",
            totalPrice: ((_y = payload === null || payload === void 0 ? void 0 : payload.price) === null || _y === void 0 ? void 0 : _y.toString()) || ((_z = rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.price) === null || _z === void 0 ? void 0 : _z.toString()) || "0",
        };
        const lineItems = [
            {
                price_data: {
                    currency: "usd",
                    product_data: { name: "RentalPack", description: "One-time RentalPack" },
                    unit_amount: Number((payload === null || payload === void 0 ? void 0 : payload.price) || (rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.price) || 0) * 100,
                },
                quantity: 1,
            },
        ];
        const session = yield config_1.stripe.checkout.sessions.create({
            mode: "payment",
            line_items: lineItems,
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
            metadata,
            locale: "en",
        });
        return { message: "Checkout session created successfully for RentPack Booking", sessionUrl: session.url };
    }
});
// const createCheckoutSessionPayment = async (req: Request, payload: Partial<IBooking>,
//   isAdmin: boolean = false) => {
//   //   const payload = req.body
//   // const isAdmin = req.user?.role === "Admin";
//   // 0. User & Jet Ski Validation
//   const userData = await User.findById(payload?.userId);
//   let rentPackData;
//   let jetSkyData;
//   if (payload?.rentPackId) {
//     rentPackData = await Rent.findById(payload?.rentPackId).populate("jet_skyId");
//     console.log("rentPackData: ", rentPackData)
//     jetSkyData = await JetSky.findById(rentPackData?.jet_skyId);
//     if (!rentPackData) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'rentPack not found!');
//     }
//     if (!jetSkyData) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'Jet_Sky not found!');
//     }
//     if (!userData) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!');
//     }
//     // . limit 14 days without (Admin)
//     let today = new Date();
//     today.setHours(0, 0, 0, 0);
//     let startDate = new Date(payload.bookingDate as Date);
//     startDate.setHours(0, 0, 0, 0);
//     const diffInDays = Math.ceil(
//       (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
//     );
//     if (!isAdmin && diffInDays > 14) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'You can only book up to 14 days in advance!'
//       );
//     }
//     // ====================================
//     const startOfDay = new Date(payload.bookingDate as Date);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(payload.bookingDate as Date);
//     endOfDay.setHours(23, 59, 59, 999);
//     // ====================================
//     // 2. Availability check 
//     const totalJetSkiesOfModel = await JetSky.countDocuments({ model: rentPackData?.model });
//     // console.log(rentPackData, "rentPackData")
//     const bookedCount = await Booking.countDocuments({ model: rentPackData?.model, bookingDate: payload?.bookingDate })
//     //  const bookedCount = await Booking.countDocuments({
//     //   bookingDate: { $gte: startOfDay, $lte: endOfDay },
//     //   jetSkyId: { $in: (await JetSky.find({ model: jetSkyData.model })).map(j => j._id) }
//     // });
//     // console.log("bookedCount: ", bookedCount, "TotalModel: ", totalJetSkiesOfModel, "Model : ", rentPackData?.model)
//     if (bookedCount >= totalJetSkiesOfModel) {
//       throw new AppError(
//         StatusCodes.CONFLICT,
//         `Sorry, all ${jetSkyData.model} Jet Skis are already booked for this date!`
//       );
//     }
//   }
//   // ==================adventurePack=====================================
//   // let adventurePackData;
//   // if(userData?.adventurePurchaseId?.length != 0){
//   //    adventurePackData = await AdventurePack.findById(userData?.adventurePurchaseId?.[0]).populate("adventurePackId") as any;
//   // }
//   // 3. Credit Check for AdventurePurchesId
//   let adventurePurchaseData
//   if (userData?.adventurePurchaseId?.length != 0) {
//     adventurePurchaseData = await PurchaseAdventurePack.findOne({
//       userId: userData?._id,
//       startDate: { $lte: new Date(payload.bookingDate as Date) },
//       expiryDate: { $gte: new Date(payload.bookingDate as Date) },
//     }).populate({
//       path: "adventurePackId",
//       populate: { path: "jet_skyId" },
//     });
//     if (adventurePurchaseData) {
//       if (adventurePurchaseData?.model !== rentPackData?.model) {
//         throw new AppError(StatusCodes.BAD_REQUEST, `You have purchased adventurePack for Only ${adventurePurchaseData?.model || "unknown"} model`
//         );
//       }
//       const purchaseDate = new Date(adventurePurchaseData.createdAt);
//       let expiryDate = new Date(purchaseDate);
//       expiryDate.setMonth(expiryDate.getMonth() + 24);
//       const bookingDate = new Date(payload.bookingDate as Date);
//       if (bookingDate > expiryDate) {
//         throw new AppError(
//           StatusCodes.BAD_REQUEST,
//           'Your Adventure Pack credits have expired! (Valid for 24 months only)'
//         );
//       }
//     }
//     if (adventurePurchaseData?.purchesCredits) {
//       if (adventurePurchaseData?.status === "inActive") {
//         throw new AppError(
//           StatusCodes.BAD_REQUEST,
//           'Your adventurePack is InActive!'
//         );
//       }
//       if (!userData?.remainingCredits || adventurePurchaseData?.remainingCredits < 1) {
//         throw new AppError(
//           StatusCodes.BAD_REQUEST,
//           'You do not have enough credits to make this booking!'
//         );
//       }
//       userData.remainingCredits = (userData.remainingCredits ?? 0) - 1;
//       await userData.save();
//       adventurePurchaseData.remainingCredits = (adventurePurchaseData.remainingCredits ?? 0) - 1;
//       await adventurePurchaseData.save();
//     }
//   }
//   // ==================adventurePack=====================================
//   const productName = payload?.adventurePurchaseId
//     ? "AdventurePack"
//     // : payload?.rentPurchaseId
//     : payload?.rentPackId
//       ? "RentalPack"
//       : " JetSky";
//   const productDescription = payload?.adventurePurchaseId
//     ? "One-time AdventurePack"
//     : payload?.rentPackId
//       ? "One-time RentalPack"
//       : "One-time JetSky";
//   // 2️⃣ Create Stripe Checkout Session
//   // let purchaseadventure
//   // if (payload?.adventurePurchaseId) {
//   //   purchaseadventure = await PurchaseAdventurePack.findById(payload?.adventurePurchaseId) as any
//   //   if (!purchaseadventure) {
//   //     throw new AppError(StatusCodes.BAD_REQUEST, 'PurchaseAdventurePack is not Found!');
//   //   }
//   // }
//   //RentPack
//   let purchaseRent
//   if (payload?.rentPackId) {
//     purchaseRent = await Rent.findById(payload?.rentPackId).populate("jet_skyId") as any
//     if (!purchaseRent) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'RentalPack is not Found!');
//     }
//   }
//   //jetSkyId
//   // let jetSky
//   // if (payload?.jetSky) {
//   //   jetSky = await JetSky.findById(payload?.jetSkyId)
//   //   if (!jetSky) {
//   //     throw new AppError(StatusCodes.BAD_REQUEST, 'jetSky is not Found!');
//   //   }
//   // }
//   const adventurePackTotalPrice = Number(payload?.price) + Number(payload?.refundableDeposit)
//   const priceAmount = purchaseRent?.price?.toString() || payload?.price?.toString() || "0";
//   const metadata: Record<string, string> = {
//     userId: payload?.userId?.toString() || "",
//     bookingType: payload?.adventurePackId ? "AdventurePack" : payload?.subscriptionPurchaseId ? " Subscription" : payload?.rentPackId ? "RentPack" : "JetSky",
//     adventurePackId: payload?.adventurePackId ? payload?.adventurePackId?.toString() : "",
//     rentPackId: payload?.rentPackId ? payload?.rentPackId?.toString() : "",
//     // bookingId: payload?.boo ? payload?.bookingId?.toString() : payload?.rentPackId ? payload?.rentPackId?.toString() : "",
//     ridesNumber: payload?.ridesNumber?.toString() || "1",
//     bookingDate: payload?.bookingDate ? new Date(payload?.bookingDate)?.toISOString() : "",
//     // drivingLicense: payload?.drivingLicense,
//     model: purchaseRent?.model || adventurePackData?.jet_skyId?.model,
//     price: payload?.price?.toString() || "0",
//     name: userData?.name as string,
//     email: userData?.email as string,
//     // totalPrice: purchaseadventure?.totalPrice?.toString() || payload?.price?.toString() || purchaseRent?.price?.toString() || "0",
//     totalPrice: payload?.adventurePackId ? adventurePackTotalPrice?.toString() : payload?.price ? payload?.price?.toString() : "0",
//     refundableDepositPaid: payload?.adventurePackId ? "300" : "0",
//   };
//   // Only add the ID that exists
//   if (payload.adventurePurchaseId) {
//     metadata.adventurePurchaseId = payload?.adventurePurchaseId.toString();
//   }
//   if (payload.rentPurchaseId) {
//     metadata.rentPurchaseId = payload?.rentPurchaseId.toString();
//   }
//   if (payload.jetSkyId) {
//     metadata.jetSkyId = payload?.jetSkyId.toString();
//   }
//   // const session = await stripe.checkout.sessions.create({
//   //   mode: "payment",
//   //   line_items: [
//   //     {
//   //       price_data: {
//   //         currency: "usd",
//   //         product_data: {
//   //           name: productName,
//   //           description: productDescription,
//   //         },
//   //         unit_amount: payload?.adventurePackId ? Number(adventurePackTotalPrice) * 100 : Number(priceAmount) * 100,
//   //       },
//   //       quantity: 1,
//   //     },
//   //   ],
//   //   success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//   //   cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
//   //   metadata,
//   //   locale: "en"
//   // });
//   let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
//   if (payload?.adventurePackId) {
//     // Adventure Pack হলে ২টা item
//     lineItems = [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "Adventure Pack",
//             description: "One-time Adventure Pack purchase",
//           },
//           unit_amount: Number(payload?.price || 0) * 100,
//         },
//         quantity: 1,
//       },
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "Refundable Deposit",
//             description: "Refundable security deposit",
//           },
//           unit_amount: Number(payload?.refundableDeposit || 0) * 100,
//         },
//         quantity: 1,
//       },
//     ];
//   } else {
//     lineItems = [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: productName,
//             description: productDescription,
//           },
//           unit_amount: Number(payload?.price || 0) * 100,
//         },
//         quantity: 1,
//       },
//     ];
//   }
//   const session = await stripe.checkout.sessions.create({
//     mode: "payment",
//     line_items: lineItems,
//     success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
//     metadata,
//     locale: "en"
//   });
//   console.log("metaData of create Session:", session.metadata)
//   // console.log("purchaseadventure:", adventurePackData)
//   // console.log("adventurePackTotalPrice:", adventurePackTotalPrice)
//   // console.log("metaData of create Session:", session.metadata)
//   // console.log("purchaseadventure :", purchaseadventure)
//   session.metadata
//   return {
//     message: "Checkout session created",
//     sessionUrl: session.url,
//   };
// }
// const createCheckoutSessionPayment = async (req: Request, payload: Partial<IBooking>,
//   isAdmin: boolean = false) => {
//   //   const payload = req.body
//   // const isAdmin = req.user?.role === "Admin";
//   // 0. User & Jet Ski Validation
//   const userData = await User.findById(payload?.userId);
//   let rentPackData;
//   let jetSkyData;
//   if (payload?.rentPackId) {
//      rentPackData = await Rent.findById(payload?.rentPackId).populate("jet_skyId");
//     console.log("rentPackData: ", rentPackData)
//      jetSkyData = await JetSky.findById(rentPackData?.jet_skyId);
//     if (!rentPackData) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'rentPack not found!');
//     }
//     if (!jetSkyData) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'Jet_Sky not found!');
//     }
//     if (!userData) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!');
//     }
//     // . limit 14 days without (Admin)
//     let today = new Date();
//     today.setHours(0, 0, 0, 0);
//     let startDate = new Date(payload.bookingDate as Date);
//     startDate.setHours(0, 0, 0, 0);
//     const diffInDays = Math.ceil(
//       (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
//     );
//     if (!isAdmin && diffInDays > 14) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'You can only book up to 14 days in advance!'
//       );
//     }
//     // ====================================
//     const startOfDay = new Date(payload.bookingDate as Date);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(payload.bookingDate as Date);
//     endOfDay.setHours(23, 59, 59, 999);
//     // ====================================
//     // 2. Availability check 
//     const totalJetSkiesOfModel = await JetSky.countDocuments({ model: rentPackData?.model });
//     // console.log(rentPackData, "rentPackData")
//     const bookedCount = await Booking.countDocuments({ model: rentPackData?.model, bookingDate: payload?.bookingDate })
//     //  const bookedCount = await Booking.countDocuments({
//     //   bookingDate: { $gte: startOfDay, $lte: endOfDay },
//     //   jetSkyId: { $in: (await JetSky.find({ model: jetSkyData.model })).map(j => j._id) }
//     // });
//     // console.log("bookedCount: ", bookedCount, "TotalModel: ", totalJetSkiesOfModel, "Model : ", rentPackData?.model)
//     if (bookedCount >= totalJetSkiesOfModel) {
//       throw new AppError(
//         StatusCodes.CONFLICT,
//         `Sorry, all ${jetSkyData.model} Jet Skis are already booked for this date!`
//       );
//     }
//   }
//   // ==================adventurePack=====================================
//   let adventurePackData;
//   if(payload?.adventurePackId){
//      adventurePackData = await AdventurePack.findById(payload?.adventurePackId).populate("jet_skyId") as any;
//     // console.log("adventurePackData: ", adventurePackData)
//     const jetSkyData = await JetSky.findById(adventurePackData?.jet_skyId);
//     if (!adventurePackData) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'adventurePackData not found!');
//     }
//     if (!jetSkyData) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'Jet_Sky not found!');
//     }
//   }
//   // ==================adventurePack=====================================
//   const productName = payload?.adventurePurchaseId
//     ? "AdventurePack"
//     // : payload?.rentPurchaseId
//     : payload?.rentPackId
//       ? "RentalPack"
//       : " JetSky";
//   const productDescription = payload?.adventurePurchaseId
//     ? "One-time AdventurePack"
//     : payload?.rentPackId
//       ? "One-time RentalPack"
//       : "One-time JetSky";
//   // 2️⃣ Create Stripe Checkout Session
//   // let purchaseadventure
//   // if (payload?.adventurePurchaseId) {
//   //   purchaseadventure = await PurchaseAdventurePack.findById(payload?.adventurePurchaseId) as any
//   //   if (!purchaseadventure) {
//   //     throw new AppError(StatusCodes.BAD_REQUEST, 'PurchaseAdventurePack is not Found!');
//   //   }
//   // }
//   //RentPack
//   let purchaseRent
//   if (payload?.rentPackId) {
//     purchaseRent = await Rent.findById(payload?.rentPackId).populate("jet_skyId") as any
//     if (!purchaseRent) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'RentalPack is not Found!');
//     }
//   }
//   //jetSkyId
//   // let jetSky
//   // if (payload?.jetSky) {
//   //   jetSky = await JetSky.findById(payload?.jetSkyId)
//   //   if (!jetSky) {
//   //     throw new AppError(StatusCodes.BAD_REQUEST, 'jetSky is not Found!');
//   //   }
//   // }
// const adventurePackTotalPrice = Number( payload?.price) + Number(payload?.refundableDeposit)
//   const priceAmount =  purchaseRent?.price?.toString() || payload?.price?.toString()  || "0";
//   const metadata: Record<string, string> = {
//     userId: payload?.userId?.toString() || "",
//     bookingType: payload?.adventurePackId ? "AdventurePack" : payload?.subscriptionPurchaseId ? " Subscription" : payload?.rentPackId ? "RentPack" : "JetSky",
//     adventurePackId: payload?.adventurePackId ? payload?.adventurePackId?.toString() : "",
//     rentPackId: payload?.rentPackId ? payload?.rentPackId?.toString() : "",
//     // bookingId: payload?.boo ? payload?.bookingId?.toString() : payload?.rentPackId ? payload?.rentPackId?.toString() : "",
//     ridesNumber: payload?.ridesNumber?.toString() || "1",
//     bookingDate: payload?.bookingDate ? new Date(payload?.bookingDate)?.toISOString() : "",
//     // drivingLicense: payload?.drivingLicense,
//     model: purchaseRent?.model || adventurePackData?.jet_skyId?.model,
//     price: payload?.price?.toString() || "0",
//     name:userData?.name as string,
//     email:userData?.email as string,
//     // totalPrice: purchaseadventure?.totalPrice?.toString() || payload?.price?.toString() || purchaseRent?.price?.toString() || "0",
//     totalPrice: payload?.adventurePackId ? adventurePackTotalPrice?.toString() :  payload?.price ? payload?.price?.toString() : "0",
//     refundableDepositPaid:  payload?.adventurePackId ? "300" :"0",
//   };
//   // Only add the ID that exists
//   if (payload.adventurePurchaseId) {
//     metadata.adventurePurchaseId = payload?.adventurePurchaseId.toString();
//   }
//   if (payload.rentPurchaseId) {
//     metadata.rentPurchaseId = payload?.rentPurchaseId.toString();
//   }
//   if (payload.jetSkyId) {
//     metadata.jetSkyId = payload?.jetSkyId.toString();
//   }
//   // const session = await stripe.checkout.sessions.create({
//   //   mode: "payment",
//   //   line_items: [
//   //     {
//   //       price_data: {
//   //         currency: "usd",
//   //         product_data: {
//   //           name: productName,
//   //           description: productDescription,
//   //         },
//   //         unit_amount: payload?.adventurePackId ? Number(adventurePackTotalPrice) * 100 : Number(priceAmount) * 100,
//   //       },
//   //       quantity: 1,
//   //     },
//   //   ],
//   //   success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//   //   cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
//   //   metadata,
//   //   locale: "en"
//   // });
// let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
// if (payload?.adventurePackId) {
//   // Adventure Pack হলে ২টা item
//   lineItems = [
//     {
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: "Adventure Pack",
//           description: "One-time Adventure Pack purchase",
//         },
//         unit_amount: Number(payload?.price || 0) * 100,
//       },
//       quantity: 1,
//     },
//     {
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: "Refundable Deposit",
//           description: "Refundable security deposit",
//         },
//         unit_amount: Number(payload?.refundableDeposit || 0) * 100,
//       },
//       quantity: 1,
//     },
//   ];
// } else {
//   lineItems = [
//     {
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: productName,
//           description: productDescription,
//         },
//         unit_amount: Number(payload?.price || 0) * 100,
//       },
//       quantity: 1,
//     },
//   ];
// }
// const session = await stripe.checkout.sessions.create({
//   mode: "payment",
//   line_items: lineItems,
//   success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//   cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
//   metadata,
//   locale: "en"
// });
//   console.log("metaData of create Session:", session.metadata)
//   // console.log("purchaseadventure:", adventurePackData)
//   // console.log("adventurePackTotalPrice:", adventurePackTotalPrice)
//   // console.log("metaData of create Session:", session.metadata)
//   // console.log("purchaseadventure :", purchaseadventure)
//   session.metadata
//   return {
//     message: "Checkout session created",
//     sessionUrl: session.url,
//   };
// }
// add more  service here
const getPaymentIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const PaymentData = new QueryBuilder_1.default(payment_model_1.Payment.find().populate("adventurePackId").populate("jetSkyId").populate("userId"), query).search(booking_contstant_1.paymentSearchField)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield PaymentData.modelQuery;
    const meta = yield PaymentData.countTotal();
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Payment are not found!');
    }
    return { result, meta };
});
exports.paymentServices = {
    createCheckoutSessionPayment,
    getPaymentIntoDB,
    // createCheckoutSessionWidthAdSubsPayment,
    // getSpesificPaymentIntoDB
    // input the 
};

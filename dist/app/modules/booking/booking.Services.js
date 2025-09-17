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
exports.BookingServices = exports.createBookingJetSkyByAdminIntoDB = exports.createBookingJetSkyIntoDB = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const jet_model_1 = require("../jet-sky/jet.model");
const booking_Model_1 = require("./booking.Model");
const auth_model_1 = require("../auth/auth.model");
const adventurePack_model_1 = require("../adventurePack/adventurePack.model");
const rents_model_1 = require("../rents/rents.model");
const subscription_Model_1 = require("../user/subscription.ts/subscription.Model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const purchaseAdventurePack_1 = require("./purchaseAdventurePack");
// create BookingJets_Sky
const createBookingJetSkyIntoDB = (payload_1, ...args_1) => __awaiter(void 0, [payload_1, ...args_1], void 0, function* (payload, isAdmin = false) {
    var _a, _b, _c, _d, _e, _f, _g;
    // 0. User & Jet Ski Validation
    const userData = yield auth_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
    const rentPackData = yield rents_model_1.Rent.findById(payload === null || payload === void 0 ? void 0 : payload.rentPackId).populate("jet_skyId");
    console.log("rentPackData: ", rentPackData);
    const jetSkyData = yield jet_model_1.JetSky.findById(rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.jet_skyId);
    const subscriptionPurchaseData = yield subscription_Model_1.Subscription.findById(payload === null || payload === void 0 ? void 0 : payload.subscriptionPurchaseId).populate("membershipId");
    if (payload === null || payload === void 0 ? void 0 : payload.subscriptionPurchaseId) {
        if (!subscriptionPurchaseData) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'SubscriptionPurchaseId not found!');
        }
    }
    console.log(" payload?.rentPackId: ", payload === null || payload === void 0 ? void 0 : payload.rentPackId);
    console.log(" rentPackData: ", rentPackData);
    if (payload === null || payload === void 0 ? void 0 : payload.adventurePurchaseId) {
        // const adventurePurchaseData = await PurchaseAdventurePack.findById(payload?.adventurePurchaseId) as any;
        // if (adventurePurchaseData?.status === "inActive" || adventurePurchaseData?.paymentStatus !== "paid") {
        //     throw new AppError(StatusCodes.BAD_REQUEST, 'Your AdventurePack not Active!');
        // }
        // if (!adventurePurchaseData) {
        //     throw new AppError(StatusCodes.BAD_REQUEST, 'AdventurePurchaseId not found!');
        // }
    }
    if (!rentPackData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'rentPack not found!');
    }
    if (!jetSkyData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet_Sky not found!');
    }
    if (!userData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found!');
    }
    // . limit 14 days without (Admin)
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let startDate = new Date(payload.bookingDate);
    startDate.setHours(0, 0, 0, 0);
    const diffInDays = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (!isAdmin && diffInDays > 14) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You can only book up to 14 days in advance!');
    }
    // 2. Availability check 
    const totalJetSkiesOfModel = yield jet_model_1.JetSky.countDocuments({ model: jetSkyData === null || jetSkyData === void 0 ? void 0 : jetSkyData.model });
    // console.log(rentPackData, "rentPackData")
    const bookedCount = yield booking_Model_1.Booking.countDocuments({
        bookingDate: payload.bookingDate,
        // status: 'active',
        jetSkyId: { $in: (yield jet_model_1.JetSky.find({ model: jetSkyData.model })).map(j => j._id) }
    });
    console.log("bookedCount: ", bookedCount, "TotalModel: ", totalJetSkiesOfModel, "Model : ", rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.model);
    if (bookedCount >= totalJetSkiesOfModel) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `Sorry, all ${jetSkyData.model} Jet Skis are already booked for this date!`);
    }
    // 3. Credit Check for AdventurePurchesId
    let adventurePurchaseData;
    if (payload === null || payload === void 0 ? void 0 : payload.adventurePurchaseId) {
        adventurePurchaseData = (yield booking_Model_1.PurchaseAdventurePack.findById(payload === null || payload === void 0 ? void 0 : payload.adventurePurchaseId));
        if ((adventurePurchaseData === null || adventurePurchaseData === void 0 ? void 0 : adventurePurchaseData.status) === "inActive" || (adventurePurchaseData === null || adventurePurchaseData === void 0 ? void 0 : adventurePurchaseData.paymentStatus) !== "paid") {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your AdventurePack not Active!');
        }
        if (!adventurePurchaseData) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'AdventurePurchaseId not found!');
        }
        console.log("adventurePurchaseData :", adventurePurchaseData);
        if (adventurePurchaseData) {
            if ((adventurePurchaseData === null || adventurePurchaseData === void 0 ? void 0 : adventurePurchaseData.model) !== (rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.model)) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `You have purchased adventurePack for Only ${(adventurePurchaseData === null || adventurePurchaseData === void 0 ? void 0 : adventurePurchaseData.model) || "unknown"} model`);
            }
            const purchaseDate = new Date(adventurePurchaseData.createdAt);
            let expiryDate = new Date(purchaseDate);
            expiryDate.setMonth(expiryDate.getMonth() + 24);
            const bookingDate = new Date(payload.bookingDate);
            if (bookingDate > expiryDate) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your Adventure Pack credits have expired! (Valid for 24 months only)');
            }
        }
        if (adventurePurchaseData === null || adventurePurchaseData === void 0 ? void 0 : adventurePurchaseData.purchesCredits) {
            if ((adventurePurchaseData === null || adventurePurchaseData === void 0 ? void 0 : adventurePurchaseData.status) === "inActive") {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your adventurePack is InActive!');
            }
            if (!(userData === null || userData === void 0 ? void 0 : userData.remainingCredits) || (adventurePurchaseData === null || adventurePurchaseData === void 0 ? void 0 : adventurePurchaseData.remainingCredits) < 1) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You do not have enough credits to make this booking!');
            }
            userData.remainingCredits = ((_a = userData.remainingCredits) !== null && _a !== void 0 ? _a : 0) - 1;
            yield userData.save();
            adventurePurchaseData.remainingCredits = ((_b = adventurePurchaseData.remainingCredits) !== null && _b !== void 0 ? _b : 0) - 1;
            yield adventurePurchaseData.save();
        }
    }
    if (payload === null || payload === void 0 ? void 0 : payload.subscriptionPurchaseId) {
        console.log("subscriptionPurchaseData: ", subscriptionPurchaseData);
        console.log("durationInMonths: ", (_c = subscriptionPurchaseData === null || subscriptionPurchaseData === void 0 ? void 0 : subscriptionPurchaseData.membershipId) === null || _c === void 0 ? void 0 : _c.durationInMonths);
        const durationInMonths = ((_d = subscriptionPurchaseData === null || subscriptionPurchaseData === void 0 ? void 0 : subscriptionPurchaseData.membershipId) === null || _d === void 0 ? void 0 : _d.durationInMonths) || 0;
        const subscriptionStartDate = new Date(subscriptionPurchaseData.createdAt);
        const ridesPerMonth = (_e = subscriptionPurchaseData === null || subscriptionPurchaseData === void 0 ? void 0 : subscriptionPurchaseData.membershipId) === null || _e === void 0 ? void 0 : _e.ridesPerMonth;
        console.log("ridesPerMonth: ", ridesPerMonth);
        console.log("subscriptionPurchaseData: ", subscriptionPurchaseData);
        const subscriptionEndDate = new Date(subscriptionStartDate);
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + durationInMonths);
        // Check monthly subscription limit
        const bookingDate = new Date(payload.bookingDate);
        // মাসের শুরুর তারিখ (1 তারিখ থেকে)
        const monthStart = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), 1);
        // মাসের শেষ তারিখ (শেষ দিন পর্যন্ত)
        const monthEnd = new Date(bookingDate.getFullYear(), bookingDate.getMonth() + 1, 0);
        const monthlyBookings = yield booking_Model_1.Booking.countDocuments({
            userId: payload.userId,
            subscriptionPurchaseId: payload.subscriptionPurchaseId,
            bookingDate: { $gte: monthStart, $lte: monthEnd },
        });
        if (bookingDate > subscriptionEndDate) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Your subscription expired on ${subscriptionEndDate.toDateString()}.`);
        }
        // =============================================
        if ((subscriptionPurchaseData === null || subscriptionPurchaseData === void 0 ? void 0 : subscriptionPurchaseData.status) === "canceled" || (subscriptionPurchaseData === null || subscriptionPurchaseData === void 0 ? void 0 : subscriptionPurchaseData.status) === "inActive") {
            if (!(subscriptionPurchaseData === null || subscriptionPurchaseData === void 0 ? void 0 : subscriptionPurchaseData.remainingCredits) || (subscriptionPurchaseData === null || subscriptionPurchaseData === void 0 ? void 0 : subscriptionPurchaseData.remainingCredits) < 1) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your Subscription Pack InActive!');
            }
        }
        if (subscriptionPurchaseData === null || subscriptionPurchaseData === void 0 ? void 0 : subscriptionPurchaseData.purchesCredits) {
            if (!(subscriptionPurchaseData === null || subscriptionPurchaseData === void 0 ? void 0 : subscriptionPurchaseData.remainingCredits) || (subscriptionPurchaseData === null || subscriptionPurchaseData === void 0 ? void 0 : subscriptionPurchaseData.remainingCredits) < 1) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your Subscription Pack do not have enough credits to make this booking!');
            }
        }
        // =============================================
        if (monthlyBookings >= ridesPerMonth) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Subscription limit reached! You can only book 5 Jet Skis per month with subscription.');
        }
        // decrease 1 credits from Subscription 
        yield subscription_Model_1.Subscription.findByIdAndUpdate(payload.subscriptionPurchaseId, {
            $inc: { remainingCredits: -1 }, //just 1
        }, { new: true });
        //  decrease 1 credits from User
        yield auth_model_1.User.findByIdAndUpdate(payload.userId, {
            $inc: { remainingCredits: -1 }, // just 1
        }, { new: true });
    }
    //const payloads = { ...payload, price:  payload?.adventurePurchaseId ? adventurePurchaseData?.price :  rentPackData?.price, totalPrice: payload?.adventurePurchaseId ? adventurePurchaseData?.totalPrice : 0, refundableDepositPaid: payload?.adventurePurchaseId ? adventurePurchaseData?.refundableDepositPaid : 0, }
    const payloads = Object.assign(Object.assign({}, payload), { price: (payload === null || payload === void 0 ? void 0 : payload.price)
            ? payload.price
            : (payload === null || payload === void 0 ? void 0 : payload.subscriptionPurchaseId)
                ? 0
                : (payload === null || payload === void 0 ? void 0 : payload.adventurePurchaseId)
                    ? adventurePurchaseData === null || adventurePurchaseData === void 0 ? void 0 : adventurePurchaseData.price
                    : rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.price, totalPrice: (payload === null || payload === void 0 ? void 0 : payload.price)
            ? payload.price
            : (payload === null || payload === void 0 ? void 0 : payload.adventurePurchaseId)
                ? adventurePurchaseData === null || adventurePurchaseData === void 0 ? void 0 : adventurePurchaseData.totalPrice
                : 0, refundableDepositPaid: (payload === null || payload === void 0 ? void 0 : payload.adventurePurchaseId)
            ? adventurePurchaseData === null || adventurePurchaseData === void 0 ? void 0 : adventurePurchaseData.refundableDepositPaid
            : 0, name: userData === null || userData === void 0 ? void 0 : userData.name, email: userData === null || userData === void 0 ? void 0 : userData.email });
    const data = Object.assign(Object.assign({}, payloads), { model: rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.model, jetSkyId: (_f = rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.jet_skyId) === null || _f === void 0 ? void 0 : _f._id, status: (payload === null || payload === void 0 ? void 0 : payload.adventurePurchaseId) || (payload === null || payload === void 0 ? void 0 : payload.subscriptionPurchaseId) ? 'active' : "inActive", paymentStatus: (payload === null || payload === void 0 ? void 0 : payload.adventurePurchaseId) || (payload === null || payload === void 0 ? void 0 : payload.subscriptionPurchaseId) ? 'paid' : "unpaid" });
    // console.log("data: ", data)
    const purchesCredits = userData.purchesCredits ? userData.purchesCredits : 1;
    const remainingCredits = (_g = userData.remainingCredits) !== null && _g !== void 0 ? _g : userData.purchesCredits;
    // console.log(purchesCredits)
    // console.log(remainingCredits)
    const result = yield booking_Model_1.Booking.create(data);
    if (result) {
        // bookingDate push করা
        rentPackData.bookingDate.push(payload.bookingDate);
        // save করা
        yield rentPackData.save();
    }
    return result;
});
exports.createBookingJetSkyIntoDB = createBookingJetSkyIntoDB;
// booking admin for maintanance jetsky
const createBookingJetSkyByAdminIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 0. User & Jet Ski Validation
    const userData = yield auth_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
    const rentPackData = yield rents_model_1.Rent.findById(payload === null || payload === void 0 ? void 0 : payload.rentPackId).populate("jet_skyId");
    const jetSkyData = yield jet_model_1.JetSky.findById(rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.jet_skyId);
    if (!rentPackData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'rentPack not found!');
    }
    if (!jetSkyData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Jet_Sky not found!');
    }
    if (!userData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found!');
    }
    // . limit 14 days without (Admin)
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let startDate = new Date(payload.bookingDate);
    startDate.setHours(0, 0, 0, 0);
    const diffInDays = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    // 2. Availability check 
    const totalJetSkiesOfModel = yield jet_model_1.JetSky.countDocuments({ model: jetSkyData === null || jetSkyData === void 0 ? void 0 : jetSkyData.model });
    // console.log(rentPackData, "rentPackData")
    const bookedCount = yield booking_Model_1.Booking.countDocuments({
        bookingDate: payload.bookingDate,
        // status: 'active',
        jetSkyId: { $in: (yield jet_model_1.JetSky.find({ model: jetSkyData.model })).map(j => j._id) }
    });
    console.log("bookedCount: ", bookedCount, "TotalModel: ", totalJetSkiesOfModel, "Model : ", rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.model);
    if (bookedCount >= totalJetSkiesOfModel) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `Sorry, all ${jetSkyData.model} Jet Skis are already booked for this date!`);
    }
    const payloads = Object.assign(Object.assign({}, payload), { maintenance: true, name: userData === null || userData === void 0 ? void 0 : userData.name, email: userData === null || userData === void 0 ? void 0 : userData.email });
    const data = Object.assign(Object.assign({}, payloads), { model: rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.model, jetSkyId: (_a = rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.jet_skyId) === null || _a === void 0 ? void 0 : _a._id, status: 'active', paymentStatus: 'paid' });
    const result = yield booking_Model_1.Booking.create(data);
    if (result) {
        // maintainanceDate push
        rentPackData.bookingDate.push(payload.bookingDate);
        // saves
        yield rentPackData.save();
    }
    return result;
});
exports.createBookingJetSkyByAdminIntoDB = createBookingJetSkyByAdminIntoDB;
// purchaseAdventurePack
const purchasegAdventurePackIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield auth_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
    const adventurePackData = yield adventurePack_model_1.AdventurePack.findById(payload === null || payload === void 0 ? void 0 : payload.adventurePackId);
    // console.log("payload :", payload)
    // console.log("adventurePackData :", adventurePackData)
    if (!adventurePackData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'adventurePack not found!');
    }
    if (!userData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found!');
    }
    // create credit when user parches a adventurePack
    const toalPrices = Number(payload === null || payload === void 0 ? void 0 : payload.price) + Number(payload === null || payload === void 0 ? void 0 : payload.refundableDeposit);
    const result = yield booking_Model_1.PurchaseAdventurePack.create(Object.assign(Object.assign({}, payload), { purchesCredits: payload === null || payload === void 0 ? void 0 : payload.ridesNumber, remainingCredits: payload === null || payload === void 0 ? void 0 : payload.ridesNumber, refundableDepositPaid: payload === null || payload === void 0 ? void 0 : payload.refundableDeposit, totalPrice: toalPrices, status: 'inActive', paymentStatus: 'unpaid' }));
    return result;
});
// purchaseRentPack this is nto to get
const purchasegRentPackIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userData = yield auth_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
    const rentPackData = yield rents_model_1.Rent.findById(payload === null || payload === void 0 ? void 0 : payload.rentPackId).populate("jet_skyId");
    if (!rentPackData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'RentPackId not found!');
    }
    if (!userData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found!');
    }
    const totalJetSkiesOfModel = yield jet_model_1.JetSky.countDocuments({ model: rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.model });
    const bookedCount = yield booking_Model_1.Booking.countDocuments({
        bookingDate: payload.bookingDate,
        jetSkyId: { $in: (yield jet_model_1.JetSky.find({ model: rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.model })).map(j => j._id) }
    });
    console.log("totalJetSkiesOfModel: ", totalJetSkiesOfModel);
    console.log("bookedCount: ", bookedCount);
    if (bookedCount >= totalJetSkiesOfModel) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.CONFLICT, `Sorry, all ${rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.model} RentPack are already booked for this date!`);
    }
    // 3. Credit Check
    if (userData === null || userData === void 0 ? void 0 : userData.purchesCredits) {
        if (!(userData === null || userData === void 0 ? void 0 : userData.remainingCredits) || (userData === null || userData === void 0 ? void 0 : userData.remainingCredits) < 1) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'You do not have enough credits to make this booking!');
        }
        userData.remainingCredits -= 1;
        yield userData.save();
    }
    const payloads = Object.assign(Object.assign({}, payload), { price: rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.price, jetSkyId: (_a = rentPackData === null || rentPackData === void 0 ? void 0 : rentPackData.jet_skyId) === null || _a === void 0 ? void 0 : _a._id });
    // console.log("payloads: ",payloads)
    // create credit when user parches a adventurePack
    const result = yield booking_Model_1.Booking.create(Object.assign(Object.assign({}, payloads), { remainingCredits: (_b = userData.remainingCredits) !== null && _b !== void 0 ? _b : userData.purchesCredits, purchesCredits: 1, status: 'inActive', paymentStatus: 'unpaid' }));
    return result;
});
// purchaseRentPack this is nto to get
// get All Booking
const getAllBookingIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingData = new QueryBuilder_1.default(booking_Model_1.Booking.find().populate("adventurePackId").populate("userId").populate("adventurePurchaseId").populate("jetSkyId").populate("rentPackId").populate("subscriptionPurchaseId"), query).search(purchaseAdventurePack_1.bookingDataSearchFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield bookingData.modelQuery;
    const meta = yield bookingData.countTotal();
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Booking not found!');
    }
    return { result, meta };
});
// get All Booking
const getAllSpecificBookingIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_Model_1.Booking.find({ userId: id });
    // 2️⃣ User-specific Subscriptions
    const subscription = yield subscription_Model_1.Subscription.find({ userId: id });
    // 3️⃣ User-specific Adventure Purchases
    const adventure = yield booking_Model_1.PurchaseAdventurePack.find({ userId: id });
    return { booking, subscription, adventure };
});
// get All Booking
const getAllBookingTokenIntoDB = (query, id) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingData = new QueryBuilder_1.default(booking_Model_1.Booking.find({
        userId: id,
    })
        .populate("adventurePackId")
        .populate("userId")
        .populate("adventurePurchaseId")
        .populate("jetSkyId")
        .populate("rentPackId")
        .populate("subscriptionPurchaseId"), query)
        .search(purchaseAdventurePack_1.bookingDataSearchFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield bookingData.modelQuery;
    const meta = yield bookingData.countTotal(); // returns total, page, limit etc.
    if (!result || result.length === 0) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Booking not found!');
    }
    return { result, meta };
});
// get single
const getSingleBookingIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_Model_1.Booking.findById(id).populate("adventurePackId").populate("userId").populate("adventurePurchaseId").populate("jetSkyId").populate("rentPackId").populate("subscriptionPurchaseId");
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Booking not found!');
    }
    return result;
});
//getSIngle Purchase of AdventurePack
const getAllPurchaseAdventurePackIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const adventurePackPurchase = new QueryBuilder_1.default(booking_Model_1.PurchaseAdventurePack.find().populate("adventurePackId").populate("jetSkyId").populate("userId"), query).search(purchaseAdventurePack_1.purchaseAdventurePack)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield adventurePackPurchase.modelQuery;
    const meta = yield adventurePackPurchase.countTotal();
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'PurchaseAdventurePacks are not found!');
    }
    return { result, meta };
});
// Get Total PurchaseAdventure of Current Month
const getTotalPurchaseAdventurePackIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // ==================================================
    const bookingData = yield booking_Model_1.Booking.find();
    // 1️⃣ Filter out maintenance bookings (if you want)
    const normalBookings = bookingData.filter((b) => !b.maintenance && b.status === "active");
    // 2️⃣ Aggregate total price per model
    const modelAggregation = normalBookings.reduce((acc, booking) => {
        const model = booking.model || "Unknown Jet Ski";
        const price = booking.totalPrice || booking.price || 0;
        if (!acc[model]) {
            acc[model] = 0;
        }
        acc[model] += price;
        return acc;
    }, {});
    // 3️⃣ Convert to array for frontend
    const modelData = Object.entries(modelAggregation).map(([model, price]) => ({
        model,
        price,
    }));
    // 4️⃣ Total rents
    const totalRents = modelData.reduce((sum, b) => sum + b.price, 0);
    // ==================================================
    const result = yield auth_model_1.User.find();
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User is not Found!');
    }
    // const booking = await Booking.find();
    //     // 2️⃣ User-specific Subscriptions
    //     const subscription = await Subscription.find();
    //     // 3️⃣ User-specific Adventure Purchases
    //     const adventure = await PurchaseAdventurePack.find();
    //     return { booking, subscription, adventure };
    // Get current date
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    // const bookingData = await Booking.find({
    //     createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    // });
    console.log(normalBookings);
    // console.log("bookingData: ", bookingData);
    // Count users registered this month
    const registeredUsersCount = yield auth_model_1.User.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
    const registeredUsers = yield auth_model_1.User.find({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
    const adventureData = yield booking_Model_1.PurchaseAdventurePack.find({
        startDate: { $gte: startOfMonth, $lte: endOfMonth },
        status: "active",
    });
    const subscriptionData = yield subscription_Model_1.Subscription.find({
        startDate: { $gte: startOfMonth, $lte: endOfMonth },
        status: "active",
    });
    //booking Rents
    const normalBookingss = yield booking_Model_1.Booking.find({
        adventurePurchaseId: { $exists: false },
        subscriptionPurchaseId: { $exists: false },
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
    const totalAmountbooking = normalBookingss.reduce((acc, booking) => {
        return acc + (booking.price ? booking.price : 0);
    }, 0);
    const totalAmountSub = subscriptionData.reduce((acc, sub) => {
        return acc + (sub.signUpFee ? sub.signUpFee : 0);
    }, 0);
    const totalAmountAd = adventureData.reduce((acc, add) => {
        return acc + (add.totalPrice ? add.totalPrice : 0);
    }, 0);
    return {
        totalAdventuresPurchase: adventureData.length,
        totalAmountInAdVenturePackUSD: totalAmountAd,
        totalSubscriptionPurchase: subscriptionData.length,
        totalAmountInSubscriptionUSD: totalAmountSub,
        registeredUsersCount,
        registeredUsers,
        totalBooking: bookingData.length,
        totalAmountInBookingUSD: totalAmountbooking,
        totalRents,
        modelData,
    };
});
//getAll getAllAdventurePackIntoDB
const getSinglePurchaseAdventurePackIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_Model_1.PurchaseAdventurePack.findById(id).populate("adventurePackId").populate("jetSkyId").populate("userId");
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'PurchaseAdventurePack not found!');
    }
    return result;
});
//delete AdventurePackIntoDB
const deletePurchaseAdventurePackIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_Model_1.PurchaseAdventurePack.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'PurchaseAdventurePack not found!');
    }
    return result;
});
//inActive AdventurePackIntoDB
const inActivePurchaseAdventurePackIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield booking_Model_1.PurchaseAdventurePack.findById(id);
    const status = data === null || data === void 0 ? void 0 : data.status;
    const newStatus = (data === null || data === void 0 ? void 0 : data.status) === "active" ? "inActive" : "active";
    const result = yield booking_Model_1.PurchaseAdventurePack.findByIdAndUpdate(id, { status: newStatus }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'PurchaseAdventurePack not found!');
    }
    return result;
});
//inActive Booking
const inActiveBookingIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield booking_Model_1.Booking.findById(id);
    const status = data === null || data === void 0 ? void 0 : data.status;
    const newStatus = (data === null || data === void 0 ? void 0 : data.status) === "active" ? "inActive" : "active";
    const result = yield booking_Model_1.Booking.findByIdAndUpdate(id, { status: newStatus }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Booking not found!');
    }
    return result;
});
// get All Booking
const deleteBookingIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_Model_1.Booking.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Booking not found!');
    }
    return result;
});
exports.BookingServices = {
    createBookingJetSkyIntoDB: exports.createBookingJetSkyIntoDB,
    purchasegAdventurePackIntoDB,
    purchasegRentPackIntoDB,
    getAllBookingIntoDB,
    getSingleBookingIntoDB,
    deleteBookingIntoDB,
    createBookingJetSkyByAdminIntoDB: exports.createBookingJetSkyByAdminIntoDB,
    getAllPurchaseAdventurePackIntoDB,
    getSinglePurchaseAdventurePackIntoDB,
    deletePurchaseAdventurePackIntoDB,
    inActivePurchaseAdventurePackIntoDB,
    inActiveBookingIntoDB,
    getTotalPurchaseAdventurePackIntoDB,
    getAllSpecificBookingIntoDB,
    getAllBookingTokenIntoDB
};

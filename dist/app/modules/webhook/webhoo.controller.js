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
exports.webhookController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const subscription_Model_1 = require("../user/subscription.ts/subscription.Model");
const payment_model_1 = require("../payment/payment.model");
const booking_Model_1 = require("../booking/booking.Model");
const auth_model_1 = require("../auth/auth.model");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
// apiVersion: "2025-01-27",
});
const webhookController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        // console.error("Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const metadata = session.metadata || {};
                console.log(metadata, "metaData of WEBSHOOK CONTROLER===>>>>>>>>");
                console.log(session, "session of WEBSHOOK CONTROLER===>>>>>>>>");
                if (metadata.bookingType === "AdventurePack") {
                    const startDate = new Date();
                    let expiryDate = new Date(startDate);
                    expiryDate.setMonth(expiryDate.getMonth() + 24);
                    expiryDate.setUTCHours(23, 59, 59, 999);
                    const newAd = yield booking_Model_1.PurchaseAdventurePack.create({
                        userId: metadata.userId,
                        adventurePackId: metadata.adventurePackId,
                        type: "onetime",
                        ridesNumber: parseInt(metadata.ridesNumber),
                        model: metadata === null || metadata === void 0 ? void 0 : metadata.model,
                        // price: parseFloat(metadata.price),
                        price: parseFloat(metadata.price),
                        totalPrice: parseFloat(metadata.totalPrice),
                        stripePaymentIntentId: session.payment_intent,
                        status: "active",
                        name: metadata === null || metadata === void 0 ? void 0 : metadata.name,
                        email: metadata === null || metadata === void 0 ? void 0 : metadata.email,
                        paymentStatus: "paid",
                        purchesCredits: parseInt(metadata.ridesNumber),
                        remainingCredits: parseInt(metadata.ridesNumber),
                        refundableDeposit: parseInt(metadata.refundableDepositPaid),
                        startDate,
                        expiryDate,
                    });
                    // Record of Payment
                    yield payment_model_1.Payment.create({
                        userId: metadata.userId,
                        adventurePackId: metadata.adventurePackId,
                        type: "onetime",
                        name: metadata === null || metadata === void 0 ? void 0 : metadata.name,
                        email: metadata === null || metadata === void 0 ? void 0 : metadata.email,
                        ridesNumber: parseInt(metadata.ridesNumber),
                        model: metadata === null || metadata === void 0 ? void 0 : metadata.model,
                        price: parseFloat(metadata.price),
                        totalPrice: parseFloat(metadata.totalPrice),
                        stripePaymentIntentId: session.payment_intent,
                        status: "active",
                        paymentStatus: "paid",
                        purchesCredits: parseInt(metadata.ridesNumber),
                        remainingCredits: parseInt(metadata.ridesNumber),
                        refundableDeposit: parseInt(metadata.refundableDepositPaid),
                        startDate,
                        expiryDate,
                    });
                    yield auth_model_1.User.findByIdAndUpdate(metadata.userId, {
                        $inc: {
                            remainingCredits: parseInt(metadata.ridesNumber),
                            purchesCredits: parseInt(metadata.ridesNumber),
                        },
                        $push: { adventurePurchaseId: newAd._id },
                    });
                }
                break;
                break;
                // const userId = session.metadata?.userId;
                // const membershipId = session.metadata?.memberShipPlanId;
                // if (session.subscription && userId && membershipId) {
                //   const startDate = new Date();
                //   let endDate: Date;
                //   // Safe endDate calculation
                //   try {
                //     endDate = new Date(startDate);
                //     endDate.setMonth(endDate.getMonth() + 1); 
                //     if (isNaN(endDate.getTime())) {
                //       throw new Error("Invalid endDate");
                //     }
                //   } catch (error) {
                //     console.log("Invalid endDate, using startDate as fallback");
                //     endDate = startDate;
                //   }
                //   await Subscription.create({
                //     userId,
                //     membershipId,
                //     type: "recurring",
                //     stripeSubscriptionId: session.subscription as string,
                //     status: "active",
                //     startDate,
                //     endDate,
                //     signUpFeePaid: false,
                //     refundableDepositPaid: false,
                //     refundAmount: 0,
                //     damagesDeducted: 0,
                //   });
                //   console.log("🎉 Subscription saved in DB");
                // }
            }
            case "customer.subscription.created": {
                const subscription = event.data.object;
                console.log("subscription============>: ");
                const startDate = subscription.start_date
                    ? new Date(subscription.start_date * 1000)
                    : new Date();
                // =====================================
                const durationInMonths = ((_a = subscription.metadata) === null || _a === void 0 ? void 0 : _a.durationInMonths)
                    ? parseInt(subscription.metadata.durationInMonths)
                    : null;
                let endDate;
                if (durationInMonths && !isNaN(durationInMonths)) {
                    endDate = new Date(startDate);
                    endDate.setMonth(endDate.getMonth() + durationInMonths);
                    endDate.setUTCHours(23, 59, 59, 999);
                }
                else {
                    // fallback: stripe এর current_period_end ব্যবহার করবে
                    endDate = subscription.current_period_end
                        ? new Date(subscription.current_period_end * 1000)
                        : new Date(startDate);
                }
                // console.log("📌 Subscription Duration:", durationInMonths, "months");
                // console.log("✅ End Date:", endDate);
                // console.log(subscription, "Subscription")
                const newSub = yield subscription_Model_1.Subscription.findOneAndUpdate({ stripeSubscriptionId: subscription.id }, {
                    userId: (_b = subscription.metadata) === null || _b === void 0 ? void 0 : _b.userId,
                    membershipId: (_c = subscription.metadata) === null || _c === void 0 ? void 0 : _c.memberShipPlanId,
                    type: "recurring",
                    stripeSubscriptionId: subscription.id,
                    status: "active",
                    startDate,
                    endDate,
                    name: (_d = subscription === null || subscription === void 0 ? void 0 : subscription.metadata) === null || _d === void 0 ? void 0 : _d.name,
                    email: (_e = subscription === null || subscription === void 0 ? void 0 : subscription.metadata) === null || _e === void 0 ? void 0 : _e.email,
                    purchesCredits: 5,
                    remainingCredits: 5,
                    signUpFee: (_f = subscription.metadata) === null || _f === void 0 ? void 0 : _f.signUpFeePaid,
                    price: Number((_g = subscription.metadata) === null || _g === void 0 ? void 0 : _g.signUpFeePaid) + Number((_h = subscription.metadata) === null || _h === void 0 ? void 0 : _h.price),
                    signUpFeePaid: true,
                    refundableDepositPaid: false,
                    refundAmount: 0,
                    damagesDeducted: 0,
                }, { upsert: true, new: true });
                try {
                    const newPayment = yield payment_model_1.Payment.create({
                        userId: (_j = subscription.metadata) === null || _j === void 0 ? void 0 : _j.userId,
                        membershipId: (_k = subscription.metadata) === null || _k === void 0 ? void 0 : _k.memberShipPlanId,
                        type: "recurring",
                        stripeSubscriptionId: subscription.id,
                        status: "active",
                        startDate,
                        endDate,
                        name: (_l = subscription === null || subscription === void 0 ? void 0 : subscription.metadata) === null || _l === void 0 ? void 0 : _l.name,
                        email: (_m = subscription === null || subscription === void 0 ? void 0 : subscription.metadata) === null || _m === void 0 ? void 0 : _m.email,
                        purchesCredits: 5,
                        remainingCredits: 5,
                        signUpFee: (_o = subscription.metadata) === null || _o === void 0 ? void 0 : _o.signUpFeePaid,
                        signUpFeePaid: true,
                        refundableDepositPaid: false,
                        price: Number((_p = subscription.metadata) === null || _p === void 0 ? void 0 : _p.signUpFeePaid) + Number((_q = subscription.metadata) === null || _q === void 0 ? void 0 : _q.price),
                        refundAmount: 0,
                        damagesDeducted: 0,
                    });
                    console.log("Payment created:", newPayment._id);
                }
                catch (err) {
                    console.error("Payment create failed:", err.message);
                }
                yield auth_model_1.User.findByIdAndUpdate((_r = subscription.metadata) === null || _r === void 0 ? void 0 : _r.userId, {
                    $inc: { remainingCredits: 5, purchesCredits: 5 },
                    $push: { subscriptionPurchaseId: newSub._id },
                }, { new: true });
                // await User.findByIdAndUpdate(subscription.metadata?.userId, {
                //   purchesCredits: 5,
                // })
                // await User.findByIdAndUpdate(
                //   subscription.metadata?.userId,
                //   { $push: { subscriptionPurchaseId: newSub._id } },
                //   { new: true }
                // );
                console.log("🎉 Subscription CREATED & saved in DB");
                break;
            }
            case "customer.subscription.updated": {
                const subscription = event.data.object;
                //  const userId = session.metadata?.userId;
                // const membershipId = session.metadata?.memberShipPlanId;
                const startDate = subscription.start_date !== undefined
                    ? new Date(subscription.start_date * 1000)
                    : new Date();
                const currentPeriodEnd = subscription.current_period_end;
                const endDate = currentPeriodEnd !== undefined
                    ? new Date(currentPeriodEnd * 1000)
                    : new Date();
                if (isNaN(endDate.getTime())) {
                    console.log("Invalid endDate from Stripe, using startDate as fallback");
                }
                yield subscription_Model_1.Subscription.findOneAndUpdate({ stripeSubscriptionId: subscription.id }, {
                    status: subscription.status === "active"
                        ? "active"
                        : subscription.status === "canceled"
                            ? "canceled"
                            : "pending",
                    startDate,
                    endDate: isNaN(endDate.getTime()) ? startDate : endDate,
                }, { upsert: true, new: true });
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                yield subscription_Model_1.Subscription.findOneAndUpdate({ stripeSubscriptionId: subscription.id }, {
                    status: "canceled",
                    endDate: new Date(),
                });
                break;
            }
            case "invoice.payment_succeeded": {
                const invoice = event.data.object;
                if (invoice.subscription) {
                    const subscriptionId = invoice.subscription;
                    const subscription = yield subscription_Model_1.Subscription.findOne({
                        stripeSubscriptionId: subscriptionId,
                    });
                    if (subscription) {
                        const now = new Date();
                        const lastCreditAdded = subscription.lastCreditAddedAt || new Date(0);
                        // payment details save
                        yield payment_model_1.Payment.create({
                            userId: subscription.userId,
                            subscriptionId: subscription._id,
                            type: "weekly",
                            price: (Number(subscription.price) - 2000) || 0,
                            status: "active",
                            paymentStatus: "paid",
                            startDate: now,
                            endDate: now, // optional
                        });
                        const isSameMonth = now.getMonth() === lastCreditAdded.getMonth() &&
                            now.getFullYear() === lastCreditAdded.getFullYear();
                        if (!isSameMonth) {
                            yield subscription_Model_1.Subscription.findOneAndUpdate({ stripeSubscriptionId: subscriptionId }, {
                                $set: { remainingCredits: 5 },
                                $inc: { purchesCredits: 5 },
                                status: "active",
                                lastCreditAddedAt: now,
                            }, { new: true });
                        }
                        else {
                            console.log("credits not add");
                        }
                    }
                }
                break;
            }
            case "invoice.payment_failed": {
                const invoice = event.data.object;
                if (invoice.subscription) {
                    yield subscription_Model_1.Subscription.findOneAndUpdate({ stripeSubscriptionId: invoice.subscription }, { status: "pending" });
                }
                break;
            }
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const sessions = yield stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                });
                const session = sessions.data[0];
                let newAd = null;
                const metadata = (session === null || session === void 0 ? void 0 : session.metadata) || {};
                const type = metadata.adventurePurchaseId || metadata.bookingId ? "onetime" : "recurring";
                const startDate = new Date();
                let endDate = new Date(startDate);
                if (metadata.adventurePackId) {
                    endDate.setMonth(endDate.getMonth() + 24);
                    endDate.setUTCHours(23, 59, 59, 999);
                }
                console.log(metadata, "metadata===============================>");
                if ((metadata === null || metadata === void 0 ? void 0 : metadata.bookingType) === "JetSky") {
                    yield booking_Model_1.Booking.create({
                        jetSkyId: metadata.jetSkyId || undefined,
                        rentPackId: metadata.bookingId || undefined,
                        type,
                        bookingDate: metadata === null || metadata === void 0 ? void 0 : metadata.bookingDate,
                        bookingTime: metadata === null || metadata === void 0 ? void 0 : metadata.bookingTime,
                        drivingLicense: metadata === null || metadata === void 0 ? void 0 : metadata.drivingLicense,
                        price: metadata.price ? parseFloat(metadata.price) : 0,
                        stripePaymentIntentId: paymentIntent.id,
                        status: "active",
                        paymentStatus: "paid",
                        startDate,
                    });
                }
                if ((metadata === null || metadata === void 0 ? void 0 : metadata.bookingType) === "RentPack") {
                    yield booking_Model_1.Booking.create({
                        userId: metadata === null || metadata === void 0 ? void 0 : metadata.userId,
                        jetSkyId: metadata.jetSkyId || undefined,
                        rentPackId: metadata.rentPackId || undefined,
                        type: "onetime",
                        bookingDate: metadata === null || metadata === void 0 ? void 0 : metadata.bookingDate,
                        bookingTime: metadata === null || metadata === void 0 ? void 0 : metadata.bookingTime,
                        model: metadata === null || metadata === void 0 ? void 0 : metadata.model,
                        name: metadata === null || metadata === void 0 ? void 0 : metadata.name,
                        email: metadata === null || metadata === void 0 ? void 0 : metadata.email,
                        drivingLicense: metadata === null || metadata === void 0 ? void 0 : metadata.drivingLicense,
                        ridesNumber: metadata.ridesNumber ? parseInt(metadata.ridesNumber) : undefined,
                        price: metadata.price ? parseFloat(metadata.price) : 0,
                        totalPrice: metadata.totalPrice ? parseFloat(metadata.totalPrice) : 0,
                        stripePaymentIntentId: paymentIntent.id,
                        status: "active",
                        paymentStatus: "paid",
                        startDate,
                    });
                    yield payment_model_1.Payment.create({
                        userId: metadata === null || metadata === void 0 ? void 0 : metadata.userId,
                        jetSkyId: metadata.jetSkyId || undefined,
                        rentPackId: metadata.rentPackId || undefined,
                        type: "onetime",
                        bookingDate: metadata === null || metadata === void 0 ? void 0 : metadata.bookingDate,
                        model: metadata === null || metadata === void 0 ? void 0 : metadata.model,
                        drivingLicense: metadata === null || metadata === void 0 ? void 0 : metadata.drivingLicense,
                        ridesNumber: metadata.ridesNumber ? parseInt(metadata.ridesNumber) : undefined,
                        price: metadata.price ? parseFloat(metadata.price) : 0,
                        stripePaymentIntentId: paymentIntent.id,
                        status: "active",
                        paymentStatus: "paid",
                        startDate,
                    });
                }
                break;
            }
            case "payment_intent.payment_failed":
                // Optional: log payment intents
                break;
            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }
        res.status(200).json({ received: true });
    }
    catch (err) {
        console.error("❌ Error handling event:", err.message);
        res.status(500).send("Internal server error");
    }
});
exports.webhookController = webhookController;

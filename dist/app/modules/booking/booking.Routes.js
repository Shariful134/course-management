"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const ValidateRequest_1 = __importDefault(require("../../../middlewares/ValidateRequest"));
const booking_Validation_1 = require("./booking.Validation");
const booking_Controllers_1 = require("./booking.Controllers");
const router = express_1.default.Router();
// create BookingJetSky
router.post("/create/dayRental", (0, auth_1.default)("Admin", "Administrator", "User"), (0, ValidateRequest_1.default)(booking_Validation_1.BookingValidation.jetSkyBookingValidation), booking_Controllers_1.BookingContnrollers.createBookingJetSky);
// create BookingJetSky
router.post("/create/dayRentalbyAdmin", (0, auth_1.default)("Admin", "Administrator"), (0, ValidateRequest_1.default)(booking_Validation_1.BookingValidation.jetSkyBookingValidation), booking_Controllers_1.BookingContnrollers.createBookingJetSkyByAdmin);
// purches adventurePack
router.post("/purchase/adventurePack", (0, auth_1.default)("Admin", "Administrator", "User"), 
// validateRequest(BookingValidation.jetSkyBookingValidation),
booking_Controllers_1.BookingContnrollers.purchaseAdventurePack);
// create booking RentPack
router.post("/create/rentPack", (0, auth_1.default)("Admin", "Administrator", "User"), 
// validateRequest(BookingValidation.jetSkyBookingValidation),
booking_Controllers_1.BookingContnrollers.purchaseRentPack);
// getAllBooking
router.get("/get", booking_Controllers_1.BookingContnrollers.getAllBooking);
// getAllBooking
router.get("/get/token/", (0, auth_1.default)("User"), booking_Controllers_1.BookingContnrollers.getAllBookingToken);
// getSingleBooking
router.get("/get/:id", booking_Controllers_1.BookingContnrollers.getSingleBooking);
// getSingleBooking
router.get("/get/all/:id", booking_Controllers_1.BookingContnrollers.getAllSpecificBooking);
// delteBooking
router.delete("/delete/:id", (0, auth_1.default)("Admin", "Administrator"), booking_Controllers_1.BookingContnrollers.deleteBooking);
// getAllPurchaseAdventurePack
router.get("/purchase/adventurePack/get", booking_Controllers_1.BookingContnrollers.getAllPurchaseAdventurePack);
// getAllPurchaseAdventurePack
router.get("/purchase/adventurePack/total", (0, auth_1.default)("Admin", "Administrator"), booking_Controllers_1.BookingContnrollers.getTotalPurchaseAdventurePack);
// getSinglePurchaseAdventurePack
router.get("/purchase/adventurePack/get/:id", booking_Controllers_1.BookingContnrollers.getSinglePurchaseAdventurePack);
// deltePurchaseAdventurePack
router.delete("purchase/adventurePack/delete/:id", (0, auth_1.default)("Admin", "Administrator"), booking_Controllers_1.BookingContnrollers.deletePurchaseAdventurePack);
// Inactiveted  PurchaseAdventurePack
router.patch("/purchase/adventurePack/inActive/:id", (0, auth_1.default)("Admin", "Administrator"), booking_Controllers_1.BookingContnrollers.inActivePurchaseAdventurePack);
// Inactiveted or activeted  PurchaseAdventurePack
router.patch("/inActiveOrActive/:id", (0, auth_1.default)("Admin", "Administrator"), booking_Controllers_1.BookingContnrollers.inActiveOrActiveBooking);
exports.bookingRoutes = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdventurePack = void 0;
const mongoose_1 = require("mongoose");
const adventurePackSchema = new mongoose_1.Schema({
    jet_skyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "JetSky",
        required: true,
    },
    title: { type: String, trim: true, required: true },
    discountPercentage: { type: Number, required: true },
    ridesPricing3: { type: Number, required: true },
    ridesPricing5: { type: Number, required: true },
    ridesPricing10: { type: Number, required: true },
    refundAmount: { type: Number, required: true },
    feature_list: { type: [String], default: [], required: false }
}, { timestamps: true });
exports.AdventurePack = (0, mongoose_1.model)('AdventurePack', adventurePackSchema);

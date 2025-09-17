"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallary = exports.JetSky = void 0;
const mongoose_1 = require("mongoose");
const jetSkySchema = new mongoose_1.Schema({
    name: { type: String, trim: true, required: true },
    model: { type: String, trim: true, required: true },
    hp: { type: Number, trim: true, required: true },
    price: { type: Number, trim: true, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: false },
}, { timestamps: true });
exports.JetSky = (0, mongoose_1.model)('JetSky', jetSkySchema);
const gallarySchema = new mongoose_1.Schema({ images: [{ type: String }] });
exports.Gallary = (0, mongoose_1.model)('Gallary', gallarySchema);

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadFile = void 0;
const image_upload_1 = require("./image.upload");
// import { uploadToDigitalOceanAWS, deleteFromDigitalOceanAWS } from '../services/digitalOceanService';
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const uploadedFile = yield (0, image_upload_1.uploadToDigitalOceanAWS)(req.file);
        res.status(200).json({
            message: 'File uploaded successfully',
            fileUrl: uploadedFile.Location,
        });
    }
    catch (error) {
        console.log("erorr: ", error);
        res.status(500).json({ message: 'Upload failed', error });
    }
});
exports.uploadFile = uploadFile;
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileUrl } = req.body;
        if (!fileUrl) {
            return res.status(400).json({ message: 'File URL is required' });
        }
        yield (0, image_upload_1.deleteFromDigitalOceanAWS)(fileUrl);
        res.status(200).json({ message: 'File deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Delete failed', error });
    }
});
exports.deleteFile = deleteFile;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const file_controllers_1 = require("./file.controllers");
const upload_1 = require("../../../utils/upload");
// import { uploadFile, deleteFile } from '../controllers/fileController';
const router = express_1.default.Router();
// Multer setup (temporary local storage)
// const upload = multer({ dest: 'uploads/' });
// Upload route
router.post('/upload', upload_1.upload.single('file'), file_controllers_1.uploadFile);
// Delete route
router.delete('/delete', file_controllers_1.deleteFile);
exports.fileRoutes = router;

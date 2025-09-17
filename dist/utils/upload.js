"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterErrors = exports.fileUploader = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
// Memory storage - no files saved to disk
const memoryStorage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
exports.upload = (0, multer_1.default)({
    storage: memoryStorage, // ← NO DISK SAVING
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 10, // Max 10 files
    },
    fileFilter: fileFilter,
});
// Upload configurations
const uploadSingle = exports.upload.single('image');
const uploadMultiple = exports.upload.fields([
    { name: 'files', maxCount: 10 },
]);
exports.fileUploader = {
    upload: exports.upload,
    uploadSingle,
    uploadMultiple,
};
// Error handling middleware
const handleMulterErrors = (error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large (max 10MB)' });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ error: 'Too many files (max 10)' });
        }
    }
    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({ error: error.message });
    }
    next(error);
};
exports.handleMulterErrors = handleMulterErrors;
// import multer from "multer";
// // Use memory storage instead of disk storage
// export const upload = multer({
//   storage: multer.memoryStorage(), // ← FILES STAY IN MEMORY
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit
//   },
//   fileFilter: (req: any, file: any, cb: any) => {
//     // Accept images only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
//       return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
//   },
// });

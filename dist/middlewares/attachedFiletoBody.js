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
const image_upload_1 = require("../app/modules/upload/image.upload");
const attachFileToBody = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Upload the file to DigitalOcean Spaces
        // const fileUrl = await uploadToDigitalOceanAWS(req.file); // Use `await` here
        // For single file
        if (req.file) {
            const fileUrl = yield (0, image_upload_1.uploadToDigitalOceanAWS)(req.file);
            req.body.images = [fileUrl]; // store in array for consistency
        }
        // For multiple files
        if (req.files) {
            // req.files can be an object or array depending on multer setup
            const files = req.files;
            const uploadPromises = files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                return (yield (0, image_upload_1.uploadToDigitalOceanAWS)(file)).Location; // return Promise
            }));
            req.body.images = yield Promise.all(uploadPromises);
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = attachFileToBody;

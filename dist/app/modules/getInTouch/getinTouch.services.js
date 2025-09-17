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
exports.contactService = void 0;
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const sendEmailUtitls_1 = __importDefault(require("../../../utils/sendEmailUtitls"));
const tamplate_1 = require("../../../utils/tamplate");
const http_status_codes_1 = require("http-status-codes");
// const emailToAdmin = process.env.ADMIN_EMAIL as string; 
exports.contactService = {
    submitContactForm(name, email, message, adminEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            // const emailTo = emailToAdmin;
            const emailTo = { adminEmail };
            const mailSubject = "Denis_Nunez User Contact Form";
            const contactEmailHTML = (0, tamplate_1.contactFormTemplate)(name, email, message);
            const mailSent = yield (0, sendEmailUtitls_1.default)(adminEmail, mailSubject, contactEmailHTML);
            if (!mailSent.accepted || mailSent.accepted.length === 0) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Something went wrong while sending your message. Please try again later");
            }
            return mailSent;
        });
    },
};

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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const SendEmailUtility = (EmailTo, EmailSubject, HtmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    if (!config_1.default.smtp_host || !config_1.default.smtp_port || !config_1.default.smtp_user || !config_1.default.smtp_pass) {
        throw new Error("Missing SMTP configuration in environment variables");
    }
    let transporter = nodemailer_1.default.createTransport({
        host: config_1.default.smtp_host,
        port: config_1.default.smtp_port,
        secure: true,
        auth: {
            user: config_1.default.smtp_user,
            pass: config_1.default.smtp_pass
        },
        tls: { rejectUnauthorized: false }
    });
    let mailOptions = {
        from: `Programming Journey<${config_1.default.smtp_user}>`,
        to: EmailTo,
        subject: EmailSubject,
        html: HtmlContent
    };
    return yield transporter.sendMail(mailOptions);
});
exports.default = SendEmailUtility;

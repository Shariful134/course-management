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
exports.getIntToucControllers = exports.contactController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const getinTouch_services_1 = require("./getinTouch.services");
const auth_model_1 = require("../auth/auth.model");
exports.contactController = {
    submit: (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, message } = req.body;
        const user = yield auth_model_1.User.findOne({ role: "Admin" });
        const result = yield getinTouch_services_1.contactService.submitContactForm(name, email, message, user === null || user === void 0 ? void 0 : user.email);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "Your message has been sent successfully! We’ll get back to you soon.",
            data: result,
        });
    })),
};
exports.getIntToucControllers = {
    contactController: exports.contactController
};
// import SendEmailUtility from "../../../utils/sendEmailUtitls";
// import { contactFormTemplate } from "../../../utils/tamplate";
// export const contactFormSubmit = async (req: Request, res: Response) => {
//   try {
//     let { name, email, message }: string | any = req.body;
//     const emailTo = emailToAdmin as string;
//     const mailSubject = "Denis_Nunez User Contact Form";
//     const contactEmailHTML = contactFormTemplate(name, email, message);
//     const mailSent = await SendEmailUtility(
//       emailTo,
//       mailSubject,
//       contactEmailHTML
//     );
//     if (mailSent.accepted.length > 0) {
//       return res.status(200).json({
//         status: true,
//         message:
//           "Your message has been sent successfully! We’ll get back to you soon.",
//         data: mailSent,
//       });
//     } else {
//       return res.status(400).json({
//         status: false,
//         message:
//           "Something went wrong while sending your message. Please try again later",
//       });
//     }
//   } catch (e) {
//     if (e instanceof Error) {
//       console.error(e.message);
//       return res.status(500).json({
//         status: false,
//         message: "Internal server error",
//         error: e.message,
//       });
//     } else {
//       console.error(e);
//       return res.status(500).json({
//         status: false,
//         message: "Internal server error",
//         error: String(e),
//       });
//     }
//   }
// };

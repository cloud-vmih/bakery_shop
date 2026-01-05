"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
exports.sendEmail = sendEmail;
// utils/emailService.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTemplate_1 = require("../templates/emailTemplate");
async function sendEmail(email, subject, html) {
    const transport = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    await transport.sendMail({
        from: `MyBakery <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: html,
    });
}
exports.emailService = {
    // Gửi OTP
    sendOTP: async (email, userName, otpCode, purpose = 'xác thực tài khoản') => {
        const html = emailTemplate_1.emailTemplates.sendOTP(userName, otpCode, purpose);
        await sendEmail(email, `[MyBakery] Mã OTP ${purpose}`, html);
    },
    // Gửi email verify
    sendVerifyEmail: async (email, userName, verifyLink) => {
        const html = emailTemplate_1.emailTemplates.verifyEmail(userName, verifyLink);
        await sendEmail(email, '[MyBakery] Xác minh địa chỉ email', html);
    },
    // Gửi form hoàn tiền
    sendRefundForm: async (email, userName, orderId, refundFormLink) => {
        const html = emailTemplate_1.emailTemplates.refundFormEmail(userName, orderId, refundFormLink);
        await sendEmail(email, `[MyBakery] Form hoàn tiền đơn hàng #${orderId}`, html);
    },
};

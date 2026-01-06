"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
exports.sendEmail = sendEmail;
const emailTemplate_1 = require("../templates/emailTemplate");
const mail_1 = __importDefault(require("@sendgrid/mail"));
// Khởi tạo SendGrid với API Key
if (process.env.SENDGRID_API_KEY) {
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
}
//const resend = new Resend(process.env.RESEND_API_KEY);
async function sendEmail(email, subject, html) {
    // const transport = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 465,
    //     secure: true,
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASS,
    //     },
    // });
    // await transport.sendMail({
    //     from: `MyBakery <${process.env.EMAIL_USER}>`,
    //     to: email,
    //     subject: subject,
    //     html: html,
    // });
    // const { data, error } = await resend.emails.send({
    //     from: "MyBakery <onboarding@resend.dev>",
    //     to: email,
    //     subject,
    //     html,
    // });
    // if (error) {
    //     console.error("Resend error:", error);
    // } else {
    //     console.log("Email sent:", data?.id);
    // }
    try {
        const msg = {
            to: email,
            from: {
                email: process.env.EMAIL_USER,
                name: 'MyBakery'
            },
            subject: subject,
            html: html,
            text: html.replace(/<[^>]*>?/gm, ''),
        };
        await mail_1.default.send(msg);
        console.log(`Email sent to ${email}`);
    }
    catch (error) {
        console.error('SendGrid Error:', {
            message: error.message,
            code: error.code,
            details: error.response?.body || 'No details'
        });
        throw error;
    }
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

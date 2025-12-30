"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
exports.sendEmail = sendEmail;
const resend_1 = require("resend");
const emailTemplate_1 = require("../templates/emailTemplate");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
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
    await resend.emails.send({
        from: `MyBakery <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html,
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

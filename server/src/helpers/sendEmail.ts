// utils/emailService.ts
import nodemailer from 'nodemailer';
import { emailTemplates } from '../templates/emailTemplate';

export async function sendEmail(
    email: string,
    subject: string,
    html: string
) {
    const transport = nodemailer.createTransport({
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

export const emailService = {
    // Gửi OTP
    sendOTP: async (
        email: string,
        userName: string,
        otpCode: string,
        purpose: string = 'xác thực tài khoản'
    ) => {
        const html = emailTemplates.sendOTP(userName, otpCode, purpose);
        await sendEmail(email, `[MyBakery] Mã OTP ${purpose}`, html);
    },

    // Gửi email verify
    sendVerifyEmail: async (
        email: string,
        userName: string,
        verifyLink: string
    ) => {
        const html = emailTemplates.verifyEmail(userName, verifyLink);
        await sendEmail(email, '[MyBakery] Xác minh địa chỉ email', html);
    },

    // Gửi form hoàn tiền
    sendRefundForm: async (
        email: string,
        userName: string,
        orderId: string,
        refundFormLink: string,
    ) => {
        const html = emailTemplates.refundFormEmail(userName, orderId, refundFormLink);
        await sendEmail(email, `[MyBakery] Form hoàn tiền đơn hàng #${orderId}`, html);
    },

};
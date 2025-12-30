import nodemailer from 'nodemailer';
import { Resend } from "resend";
import { emailTemplates } from '../templates/emailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
    email: string,
    subject: string,
    html: string
) {
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
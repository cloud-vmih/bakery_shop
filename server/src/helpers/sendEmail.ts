import nodemailer from 'nodemailer';
import { emailTemplates } from '../templates/emailTemplate';
import sgMail from '@sendgrid/mail';

// Khởi tạo SendGrid với API Key
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

//const resend = new Resend(process.env.RESEND_API_KEY);

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
                email: process.env.EMAIL_USER!,
                name: 'MyBakery'
            },
            subject: subject,
            html: html,
            text: html.replace(/<[^>]*>?/gm, ''),
        };

        await sgMail.send(msg);
        console.log(`Email sent to ${email}`);
    } catch (error: any) {
        console.error('SendGrid Error:', {
            message: error.message,
            code: error.code,
            details: error.response?.body || 'No details'
        });
        throw error; 
    }
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
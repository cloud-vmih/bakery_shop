import nodemailer from "nodemailer";

export async function sendVerifyEmail(email: string, subject: string, html: string) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });


  await transport.sendMail({
    from: "Your App <no-reply@app.com>",
    to: email,
    subject: subject,
    html: html
  });
}
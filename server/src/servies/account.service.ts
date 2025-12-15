import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { googleClient } from "../config/google";
import { createEmailVerification, isAccountVerified, verify, isEmailVerified } from "../db/verify.db";
import { sendEmail } from "../helper/sendEmail"
import { createAccount, findAccountByUsername, findUserByAccountId, createUser, socialAuthRepo, findUserByEmail, isPhoneNumberTaken , updatePassword } from "../db/db.account";
import { Account } from "../entity/Account";
import { Customer } from "../entity/Customer";
import { redis } from "../config/redis";

export const registerUser = async (username: string, password: string, email: string, phoneNumber: string, fullName: string, dateOfBirth: Date, avatarURL: string) => {

  try {

    const existing = await findAccountByUsername(username);
    if (existing) throw new Error("Username already exists");

    if (await findUserByEmail(email)) throw new Error("Email already used");
    if (await isPhoneNumberTaken(phoneNumber)) throw new Error("Phone Number already used")

    const hashed = await bcrypt.hash(password, 10);
    const account = new Account();
    account.username = username;
    account.password = hashed;
    const acc = await createAccount(account);

    if (!acc) throw new Error("Account creation failed");

    const customer = new Customer();
    customer.fullName = fullName;
    customer.email = email;
    customer.phoneNumber = phoneNumber || "";
    customer.dateOfBirth = dateOfBirth || new Date();
    customer.account = acc;
    customer.avatarURL = avatarURL || "";

    const user = await createUser(customer);

    const token = jwt.sign({ id: acc.id, username: acc.username }, process.env.EMAIL_VERIFY_SECRET!, { expiresIn: "1h" });

    await createEmailVerification(acc.id!);

    const verifyLink = `${process.env.CLIENT_URL}/verify?token=${token}`;

    await sendEmail(
      user.email!,
      "Verify your email",
      `
      <h2>Verify your account</h2>
      <p>Click the link below:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `
    );

    return { message: "Registered successfully. Check your email to verify." };
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (username: string, password: string) => {
  const acc = await findAccountByUsername(username);
  if (!acc) throw new Error("User not found");

  const verified = await isAccountVerified(acc.id!);
  if (!verified) throw new Error("Email not verified");

  const valid = await bcrypt.compare(password, acc.password!);
  if (!valid) throw new Error("Invalid password");

  const userInfo = await findUserByAccountId(acc.id!);

  console.log("User type:", userInfo!.type);

  const token = jwt.sign({ id: acc.id, user: userInfo }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  const refresh_token = jwt.sign({ id: acc.id, user: userInfo }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return { refresh_token, token, user: userInfo };
};

export const getUser = async (id: number) => {
  return await findUserByAccountId(id);
};


export const googleService = {
  loginWithGoogle: async (idToken: string) => {
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google Token");

    const providerUserId = payload.sub!;
    const email = payload.email || "";
    const fullName = payload.name || "";
    const avatarURL = payload.picture || "";


    const social = await socialAuthRepo.findSocialAccount(providerUserId);

    let accountId: number;
    let user: any;

    if (social) {
      accountId = social.account!.id!;

      user = await findUserByAccountId(accountId);

    } else {
      user = await findUserByEmail(email);

      if (!user) {
        const username = `google_${providerUserId}`;
        const account = new Account();
        account.username = username;
        account.password = "*";
        const acc = await createAccount(account);
        accountId = acc.id!;

        const customer = new Customer();
        customer.fullName = fullName;
        customer.email = email;
        customer.phoneNumber = "0123456789";
        customer.dateOfBirth = new Date();
        customer.account = acc;
        customer.avatarURL = avatarURL || "";
        user = await createUser(customer);
      }
      else {
        if (await isAccountVerified(user.account.id)) accountId = user.account.id;
        else throw new Error("Please verify email!")
      }

      await socialAuthRepo.linkSocialAccount(providerUserId, email, accountId!);
      await createEmailVerification(accountId)
      await verify(accountId)
    }

    const jwtPayload = {
      accountId,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        avatarURL: user.avatarURL,
        type: user.type,
      },
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, { expiresIn: "1h" });
    return { token, user: jwtPayload.user };
  },
};

export const changePassword = {
  sendOTP: async (email: string) => {

    if (!await isEmailVerified(email)) throw new Error("Email not verified")

    const OTP_TTL = 300;      // 5 phút
    const COOLDOWN_TTL = 30;  // 30 giây
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp)

    try {
      const cooldownKey = `otp_cooldown:${email}`;
      if (await redis.exists(cooldownKey)) {
        throw new Error("Vui lòng chờ 30s để gửi lại OTP");
      }
      await redis.set(`otp:${email}`, otp, {ex: OTP_TTL});
      await redis.set(cooldownKey, "1", {ex: COOLDOWN_TTL});

      const html = `
      <h2>Verify your OTP</h2>
      <p>Your OTP:</p>
      <a>${otp}</a>
    `
      sendEmail(email,
        "Verify your OTP",
        html
      )
      return ({message: "The OTP has been sent to your email, please check it."})
    }
    catch (err) {throw err}
  },
  verifyOTP: async (email: string, otp: string) => {
    const key = `otp:${email}`;
    const savedOtp = await redis.get(key);

    console.log(savedOtp)
    console.log(otp)
    if (!savedOtp) {
      throw new Error("OTP đã hết hạn");
    }

    if (savedOtp.toString() !== otp.toString()) {
      throw new Error("OTP không đúng");
    }

    await redis.del(key);
    await redis.set(`otp_verified:${email}`, "true", {ex: 300});

    return true;
  },
  resetPassword: async(newPassword: string, email: string) => {
    const verified = await redis.get(`otp_verified:${email}`);
    if (!verified) throw new Error("OTP chưa được xác thực");
    const user = await findUserByEmail(email);
    try {
      const hash = await bcrypt.hash(newPassword, 10);
      await updatePassword(hash, user?.account?.id!)
      return ({message: "Password has changed succesfully!"})
    }
    catch (err) {throw new Error("Change password failed!")}
  }
}
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { googleClient } from "../config/google";
import { createEmailVerification, isEmailVerified } from "../db/verify.db";
import { sendVerifyEmail } from "../helper/sendEmail";

import { createAccount, findAccountByUsername, findUserByAccountId, createUser, socialAuthRepo } from "../db/db.account";
import { Account } from "../entity/Account";
import { Customer } from "../entity/Customer";

export const registerUser = async (username: string, password: string, email: string, phoneNumber: string, fullName: string, dateOfBirth: Date, avatarURL: string) => {

  try {
  
    const existing = await findAccountByUsername(username);
    if (existing) throw new Error("Username already exists");

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

    const user =  await createUser(customer);

    const token = jwt.sign({ id: acc.id, username: acc.username }, process.env.EMAIL_VERIFY_SECRET!, {expiresIn: "1h"});

    await createEmailVerification(acc.id!);

    const verifyLink = `${process.env.CLIENT_URL}/verify?token=${token}`;

    await sendVerifyEmail(
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

  // const verified = await isEmailVerified(acc.id!);
  // if (!verified) throw new Error("Email not verified");

  const valid = await bcrypt.compare(password, acc.password!);
  if (!valid) throw new Error("Invalid password");

  const userInfo = await findUserByAccountId(acc.id!);

  console.log("User type:", userInfo!.type);

  const token = jwt.sign({ id: acc.id, username: acc.username }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  return { token, user: userInfo };
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

      await socialAuthRepo.linkSocialAccount(providerUserId, email, acc.id!);
    }

    const jwtPayload = {
      accountId,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        avatarURL: user.avatarURL,
      },
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, { expiresIn: "1h" });
    return { token, user: jwtPayload.user };
  },
};

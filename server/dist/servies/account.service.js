"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleService = exports.getUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_1 = require("../config/google");
const verify_db_1 = require("../db/verify.db");
const sendEmail_1 = require("../helper/sendEmail");
const db_account_1 = require("../db/db.account");
const Account_1 = require("../entity/Account");
const Customer_1 = require("../entity/Customer");
const registerUser = async (username, password, email, phoneNumber, fullName, dateOfBirth, avatarURL) => {
    try {
        const existing = await (0, db_account_1.findAccountByUsername)(username);
        if (existing)
            throw new Error("Username already exists");
        if (await (0, db_account_1.isEmailTaken)(email))
            throw new Error("Email already used");
        if (await (0, db_account_1.isPhoneNumberTaken)(phoneNumber))
            throw new Error("Phone Number already used");
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const account = new Account_1.Account();
        account.username = username;
        account.password = hashed;
        const acc = await (0, db_account_1.createAccount)(account);
        if (!acc)
            throw new Error("Account creation failed");
        const customer = new Customer_1.Customer();
        customer.fullName = fullName;
        customer.email = email;
        customer.phoneNumber = phoneNumber || "";
        customer.dateOfBirth = dateOfBirth || new Date();
        customer.account = acc;
        customer.avatarURL = avatarURL || "";
        const user = await (0, db_account_1.createUser)(customer);
        const token = jsonwebtoken_1.default.sign({ id: acc.id, username: acc.username }, process.env.EMAIL_VERIFY_SECRET, { expiresIn: "1h" });
        await (0, verify_db_1.createEmailVerification)(acc.id);
        const verifyLink = `${process.env.CLIENT_URL}/verify?token=${token}`;
        await (0, sendEmail_1.sendVerifyEmail)(user.email, "Verify your email", `
      <h2>Verify your account</h2>
      <p>Click the link below:</p>
      <a href="${verifyLink}">${verifyLink}</a>
    `);
        return { message: "Registered successfully. Check your email to verify." };
    }
    catch (err) {
        throw err;
    }
};
exports.registerUser = registerUser;
const loginUser = async (username, password) => {
    const acc = await (0, db_account_1.findAccountByUsername)(username);
    if (!acc)
        throw new Error("User not found");
    const verified = await (0, verify_db_1.isEmailVerified)(acc.id);
    if (!verified)
        throw new Error("Email not verified");
    const valid = await bcryptjs_1.default.compare(password, acc.password);
    if (!valid)
        throw new Error("Invalid password");
    const userInfo = await (0, db_account_1.findUserByAccountId)(acc.id);
    console.log("User type:", userInfo.type);
    const token = jsonwebtoken_1.default.sign({ id: acc.id, username: acc.username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    return { token, user: userInfo };
};
exports.loginUser = loginUser;
const getUser = async (id) => {
    return await (0, db_account_1.findUserByAccountId)(id);
};
exports.getUser = getUser;
exports.googleService = {
    loginWithGoogle: async (idToken) => {
        const ticket = await google_1.googleClient.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload)
            throw new Error("Invalid Google Token");
        const providerUserId = payload.sub;
        const email = payload.email || "";
        const fullName = payload.name || "";
        const avatarURL = payload.picture || "";
        const social = await db_account_1.socialAuthRepo.findSocialAccount(providerUserId);
        let accountId;
        let user;
        if (social) {
            accountId = social.account.id;
            user = await (0, db_account_1.findUserByAccountId)(accountId);
        }
        else {
            const username = `google_${providerUserId}`;
            const account = new Account_1.Account();
            account.username = username;
            account.password = "*";
            const acc = await (0, db_account_1.createAccount)(account);
            accountId = acc.id;
            const customer = new Customer_1.Customer();
            customer.fullName = fullName;
            customer.email = email;
            customer.phoneNumber = "0123456789";
            customer.dateOfBirth = new Date();
            customer.account = acc;
            customer.avatarURL = avatarURL || "";
            user = await (0, db_account_1.createUser)(customer);
            await db_account_1.socialAuthRepo.linkSocialAccount(providerUserId, email, acc.id);
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
        const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "1h" });
        return { token, user: jwtPayload.user };
    },
};

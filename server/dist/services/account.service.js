"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.googleService = exports.getUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_1 = require("../config/google");
const verify_db_1 = require("../db/verify.db");
const sendEmail_1 = require("../helpers/sendEmail");
const account_db_1 = require("../db/account.db");
const Account_1 = require("../entity/Account");
const Customer_1 = require("../entity/Customer");
const redis_1 = require("../config/redis");
const registerUser = async (username, password, email, phoneNumber, fullName, dateOfBirth, avatarURL) => {
    try {
        const existing = await (0, account_db_1.findAccountByUsername)(username);
        if (existing)
            throw new Error("Username already exists");
        if (await (0, account_db_1.findUserByEmail)(email))
            throw new Error("Email already used");
        if (await (0, account_db_1.isPhoneNumberTaken)(phoneNumber))
            throw new Error("Phone Number already used");
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const account = new Account_1.Account();
        account.username = username;
        account.password = hashed;
        const acc = await (0, account_db_1.createAccount)(account);
        if (!acc)
            throw new Error("Account creation failed");
        const customer = new Customer_1.Customer();
        customer.fullName = fullName;
        customer.email = email;
        customer.phoneNumber = phoneNumber || "";
        customer.dateOfBirth = dateOfBirth || new Date();
        customer.account = acc;
        customer.avatarURL = avatarURL || "";
        const user = await (0, account_db_1.createUser)(customer);
        const token = jsonwebtoken_1.default.sign({ id: acc.id, username: acc.username }, process.env.EMAIL_VERIFY_SECRET, { expiresIn: "1h" });
        await (0, verify_db_1.createEmailVerification)(acc.id);
        const verifyLink = `${process.env.CLIENT_URL}/verify?token=${token}`;
        // await sendEmail(
        //   user.email!,
        //   "Verify your email",
        //   `
        //   <h2>Verify your account</h2>
        //   <p>Click the link below:</p>
        //   <a href="${verifyLink}">${verifyLink}</a>
        // `
        // );
        await sendEmail_1.emailService.sendVerifyEmail(user.email, user.fullName, verifyLink);
        return { message: "Registered successfully. Check your email to verify." };
    }
    catch (err) {
        throw err;
    }
};
exports.registerUser = registerUser;
const loginUser = async (username, password) => {
    const acc = await (0, account_db_1.findAccountByUsername)(username);
    if (!acc)
        throw new Error("User not found");
    const userInfo = await (0, account_db_1.findUserByAccountId)(acc.id);
    const verified = await (0, verify_db_1.isAccountVerified)(acc.id);
    if (!verified && userInfo.type === 'Customer')
        throw new Error("Email not verified");
    if (userInfo.type === 'Staff') {
        const staffInfo = userInfo;
        if (staffInfo.status === 'locked')
            throw new Error("Tài khoản đã bị khóa");
    }
    const valid = await bcryptjs_1.default.compare(password, acc.password);
    if (!valid)
        throw new Error("Invalid password");
    console.log("User type:", userInfo.type);
    const token = jsonwebtoken_1.default.sign({ id: acc.id, user: userInfo }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
    const refresh_token = jsonwebtoken_1.default.sign({ accountId: acc.id, user: userInfo }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return { refresh_token, token, user: userInfo };
};
exports.loginUser = loginUser;
const getUser = async (id) => {
    return await (0, account_db_1.findUserByAccountId)(id);
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
        const social = await account_db_1.socialAuthRepo.findSocialAccount(providerUserId);
        let accountId;
        let user;
        if (social) {
            accountId = social.account.id;
            user = await (0, account_db_1.findUserByAccountId)(accountId);
        }
        else {
            user = await (0, account_db_1.findUserByEmail)(email);
            if (!user) {
                const username = `google_${providerUserId}`;
                const account = new Account_1.Account();
                account.username = username;
                account.password = "*";
                const acc = await (0, account_db_1.createAccount)(account);
                accountId = acc.id;
                const customer = new Customer_1.Customer();
                customer.fullName = fullName;
                customer.email = email;
                customer.phoneNumber = "0123456789";
                customer.dateOfBirth = new Date();
                customer.account = acc;
                customer.avatarURL = avatarURL || "";
                user = await (0, account_db_1.createUser)(customer);
            }
            else {
                if (await (0, verify_db_1.isAccountVerified)(user.account.id))
                    accountId = user.account.id;
                else
                    throw new Error("Please verify email!");
            }
            await account_db_1.socialAuthRepo.linkSocialAccount(providerUserId, email, accountId);
            await (0, verify_db_1.createEmailVerification)(accountId);
            await (0, verify_db_1.verify)(accountId);
        }
        const jwtPayload = {
            accountId,
            user: user,
        };
        const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_SECRET, {
            expiresIn: 10,
        });
        const refresh_token = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        return { refresh_token, token, user: jwtPayload.user };
    },
};
exports.changePassword = {
    sendOTP: async (email) => {
        if (!(await (0, verify_db_1.isEmailVerified)(email)))
            throw new Error("Email not verified");
        const user = await (0, account_db_1.findUserByEmail)(email);
        const OTP_TTL = 300; // 5 phút
        const COOLDOWN_TTL = 30; // 30 giây
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(otp);
        try {
            const cooldownKey = `otp_cooldown:${email}`;
            if (await redis_1.redis.exists(cooldownKey)) {
                throw new Error("Vui lòng chờ 30s để gửi lại OTP");
            }
            await redis_1.redis.set(`otp:${email}`, otp, { ex: OTP_TTL });
            await redis_1.redis.set(cooldownKey, "1", { ex: COOLDOWN_TTL });
<<<<<<< HEAD
            //   const html = `
            //   <h2>Verify your OTP</h2>
            //   <p>Your OTP:</p>
            //   <a>${otp}</a>
            // `;
            //   await sendEmail(email, "Verify your OTP", html);
=======
            console.log("OTP saved to Redis");
>>>>>>> origin/feature/cake-filling
            await sendEmail_1.emailService.sendOTP(email, user.fullName, otp);
            return { message: "The OTP send successfully, please check it." };
        }
        catch (err) {
            throw err;
        }
    },
    verifyOTP: async (email, otp) => {
        const key = `otp:${email}`;
        const savedOtp = await redis_1.redis.get(key);
        console.log(savedOtp);
        console.log(otp);
        if (!savedOtp) {
            throw new Error("OTP đã hết hạn");
        }
        if (savedOtp.toString() !== otp.toString()) {
            throw new Error("OTP không đúng");
        }
        await redis_1.redis.del(key);
        await redis_1.redis.set(`otp_verified:${email}`, "true", { ex: 300 });
        return true;
    },
    resetPassword: async (newPassword, email) => {
        const verified = await redis_1.redis.get(`otp_verified:${email}`);
        if (!verified)
            throw new Error("OTP chưa được xác thực");
        const user = await (0, account_db_1.findUserByEmail)(email);
        try {
            const hash = await bcryptjs_1.default.hash(newPassword, 10);
            await (0, account_db_1.updatePassword)(hash, user?.account?.id);
            return { message: "Password has changed successfully!" };
        }
        catch (err) {
            throw new Error("Change password failed!");
        }
    },
};

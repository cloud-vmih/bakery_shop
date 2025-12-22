"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.resetPassword = exports.verifyOTP = exports.sendOTP = exports.googleLogin = exports.getUserInfo = exports.login = exports.register = void 0;
const account_service_1 = require("../servies/account.service");
const node_cron_1 = __importDefault(require("node-cron"));
const db_account_1 = require("../db/db.account");
const register = async (req, res) => {
    try {
        const { username, password, password2, fullName, email, phoneNumber, dateOfBirth } = req.body;
        if (password !== password2) {
            return res.status(400).json({ error: "Passwords do not match" });
        }
        const dob = new Date(dateOfBirth);
        const user = await (0, account_service_1.registerUser)(username, password, email, phoneNumber, fullName, dob, "");
        res.status(201).json(user);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.register = register;
node_cron_1.default.schedule("*/5 * * * *", async () => {
    console.log("Running cleanup job...");
    try {
        await (0, db_account_1.deletedUserNotVerified)();
        console.log("Cleanup done!");
    }
    catch (err) {
        console.error("Cleanup error:", err);
    }
}); //Nữa bỏ vào homepage
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await (0, account_service_1.loginUser)(username, password);
        res.cookie("refresh_token", result.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
        console.log(err.message);
    }
};
exports.login = login;
const getUserInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await (0, account_service_1.getUser)(userId);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.getUserInfo = getUserInfo;
const googleLogin = async (req, res) => {
    try {
        const { id_token } = req.body;
        if (!id_token)
            return res.status(400).json({ message: "id_token missing" });
        const result = await account_service_1.googleService.loginWithGoogle(id_token);
        res.cookie("refresh_token", result.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json(result);
    }
    catch (err) {
        console.error("Google login error:", err);
        return res.status(400).json({ message: "Invalid google token" });
    }
};
exports.googleLogin = googleLogin;
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await account_service_1.changePassword.sendOTP(email);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.sendOTP = sendOTP;
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        await account_service_1.changePassword.verifyOTP(email, otp);
        res.json({ message: "Verify OTP successfully! Change your password now." });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.verifyOTP = verifyOTP;
const resetPassword = async (req, res) => {
    const { password, email } = req.body;
    try {
        const result = await account_service_1.changePassword.resetPassword(password, email);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.resetPassword = resetPassword;
const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        // Xóa cookie
        res.clearCookie("refresh_token", {
            path: "/api/refresh"
        });
        res.status(200).json({
            message: "Logged out successfully"
        });
    }
    catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.logout = logout;

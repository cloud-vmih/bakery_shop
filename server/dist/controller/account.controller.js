"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.getUserInfo = exports.login = exports.register = void 0;
const account_service_1 = require("../servies/account.service");
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
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await (0, account_service_1.loginUser)(username, password);
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
exports.authController = {
    googleLogin: async (req, res) => {
        try {
            const { id_token } = req.body;
            if (!id_token)
                return res.status(400).json({ message: "id_token missing" });
            const result = await account_service_1.googleService.loginWithGoogle(id_token);
            return res.json(result);
        }
        catch (err) {
            console.error("Google login error:", err);
            return res.status(400).json({ message: "Invalid google token" });
        }
    }
};

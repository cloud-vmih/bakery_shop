"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verify_db_1 = require("../db/verify.db");
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token || typeof token !== "string") {
            return res.status(400).json({ error: "Invalid token" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.EMAIL_VERIFY_SECRET);
        const accountId = decoded.id;
        await (0, verify_db_1.verify)(accountId);
        return res.status(200).json({ message: "Email verified successfully" });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.verifyEmail = verifyEmail;

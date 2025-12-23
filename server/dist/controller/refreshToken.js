"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refresh = async (req, res) => {
    const token = req.cookies.refresh_token;
    if (!token)
        return res.status(401).json({ message: "No refresh token" });
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const newAccessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({ accessToken: newAccessToken });
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
};
exports.refresh = refresh;

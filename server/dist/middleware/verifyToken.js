"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    // Lấy token từ header
    const authHeader = req.headers["authorization"];
    // Header kiểu: "Bearer <token>"
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    try {
        // Xác thực token
        const secret = process.env.JWT_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Gắn thông tin user vào req (để các route sau có thể dùng)
        req.user = decoded;
        next(); // Cho đi tiếp
    }
    catch (err) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};
exports.verifyToken = verifyToken;

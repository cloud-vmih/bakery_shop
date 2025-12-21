"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminOrStaff = exports.verifyStaff = exports.verifyAdmin = exports.verifyRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    // Lấy token từ header
    const authHeader = req.headers["authorization"];
    // Header kiểu: "Bearer <token>"
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        // Không có token = chưa đăng nhập
        return res.status(401).json({
            code: "NO_LOGIN",
            message: "Access denied. No token provided."
        });
    }
    try {
        // Xác thực token
        const secret = process.env.JWT_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Gắn thông tin user vào req
        req.user = decoded.user;
        next(); // Cho đi tiếp
    }
    catch (err) {
        // Phân biệt các loại lỗi token
        if (err.name === "TokenExpiredError") {
            // Token đã hết hạn
            return res.status(401).json({
                code: "TOKEN_EXPIRED",
                message: "Token has expired. Please refresh or login again."
            });
        }
        else if (err.name === "JsonWebTokenError") {
            // Token không hợp lệ
            return res.status(403).json({
                code: "INVALID_TOKEN",
                message: "Invalid token."
            });
        }
        else {
            // Lỗi khác
            return res.status(403).json({
                message: "Token verification failed."
            });
        }
    }
};
exports.verifyToken = verifyToken;
const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.type) {
            return res.status(401).json({
                code: "NO_USER_INFO",
                message: "Access denied. User information not found."
            });
        }
        if (!allowedRoles.includes(user.type)) {
            return res.status(403).json({
                code: "FORBIDDEN",
                message: "Access denied. Insufficient permissions."
            });
        }
        next();
    };
};
exports.verifyRole = verifyRole;
exports.verifyAdmin = (0, exports.verifyRole)("Admin");
exports.verifyStaff = (0, exports.verifyRole)("Staff");
exports.verifyAdminOrStaff = (0, exports.verifyRole)("Admin", "Staff");

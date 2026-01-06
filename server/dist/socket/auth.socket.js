"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socketAuth = (socket, next) => {
    const token = socket.handshake.auth?.token;
    const guestId = socket.handshake.auth?.guestId;
    if (!token && !guestId) {
        return next(new Error("Unauthorized"));
    }
    try {
        if (token) {
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                return next(new Error("JWT_SECRET not defined"));
            }
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            if (typeof decoded === "string") {
                return next(new Error("Invalid token payload"));
            }
            const payload = decoded;
            socket.data.user = payload.user;
        }
        else {
            socket.data.user = {
                id: guestId,
                type: "GUEST",
            };
        }
        next();
    }
    catch {
        next(new Error("Invalid or expired token"));
    }
};
exports.socketAuth = socketAuth;

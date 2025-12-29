"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.io = void 0;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const server_1 = __importDefault(require("../server"));
const chat_socket_1 = require("./chat.socket");
const auth_socket_1 = require("./auth.socket");
const notification_socket_1 = require("./notification.socket");
const server = http_1.default.createServer(server_1.default);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    },
});
exports.io = io;
io.use(auth_socket_1.socketAuth);
io.on('connection', async (socket) => {
    console.log('Socket connected: ', socket.id);
    (0, chat_socket_1.chatSocket)(io, socket);
    (0, notification_socket_1.notificationSocket)(socket);
    socket.on('disconnect', () => {
        console.log('Socket disconnected: ', socket.id);
    });
});

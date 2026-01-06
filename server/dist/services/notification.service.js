"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.markRead = exports.list = exports.sendNotification = void 0;
const user_db_1 = require("../db/user.db");
const socket_1 = require("../socket");
const notificationDB = __importStar(require("../db/notification.db"));
<<<<<<< HEAD
const sendNotification = async (userIds, title, contents, notiType, href) => {
    const users = (await Promise.all(userIds.map(id => (0, user_db_1.getRawUserByID)(id)))).filter((u) => u !== null);
    const noti = await notificationDB.create(title, contents, notiType, users, href);
=======
const sendNotification = async (userIds, title, contents, notiType) => {
    const users = (await Promise.all(userIds.map(id => (0, user_db_1.getRawUserByID)(id)))).filter((u) => u !== null);
    const noti = await notificationDB.create(title, contents, notiType, users);
>>>>>>> origin/feature/cake-filling
    users.forEach((u) => {
        socket_1.io.to(`notify:${u.id}`).emit("notification:new", noti);
    });
    return noti;
};
exports.sendNotification = sendNotification;
const list = async (userId) => {
    const noti = await notificationDB.getByUserId(userId);
    console.log(noti);
    return noti.map(n => ({
        id: n.id,
        title: n.title,
        content: n.contents,
<<<<<<< HEAD
        sentAt: n.sentAt,
        isRead: n.isRead,
        href: n.href,
=======
        createAt: n.sentAt,
        isRead: n.isRead,
>>>>>>> origin/feature/cake-filling
    }));
};
exports.list = list;
const markRead = async (notiId, userId) => {
    return await notificationDB.markRead(notiId);
};
exports.markRead = markRead;

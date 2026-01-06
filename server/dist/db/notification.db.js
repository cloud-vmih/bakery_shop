"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markRead = exports.getByUserId = exports.create = void 0;
const database_1 = require("../config/database");
const Notification_1 = require("../entity/Notification");
const notiRepo = database_1.AppDataSource.getRepository(Notification_1.Notification);
<<<<<<< HEAD
const create = async (title, contents, notiType, users, href) => {
    const notification = notiRepo.create({ title, contents, notiType, users, href });
=======
const create = async (title, contents, notiType, users) => {
    const notification = notiRepo.create({ title, contents, notiType, users });
>>>>>>> origin/feature/cake-filling
    return await notiRepo.save(notification);
};
exports.create = create;
const getByUserId = async (userId) => {
    return await notiRepo.find({
        relations: {
            users: true,
        },
        where: {
            users: {
                id: userId,
            },
        },
        order: {
            sentAt: "DESC",
        },
    });
};
exports.getByUserId = getByUserId;
const markRead = async (notiId) => {
    return await notiRepo.update({ id: notiId }, { isRead: true });
};
exports.markRead = markRead;

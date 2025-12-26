import { Notification } from "../entity/Notification";
import { User } from "../entity/User";
import { getRawUserByID } from "../db/user.db";
import { ENotiType } from "../entity/enum/enum";
import { io } from "../socket";
import * as notificationDB from "../db/notification.db";

export const sendNotification = async ( userIds: number[], title: string, contents: string, notiType: ENotiType) => {
    const users = (await Promise.all(
        userIds.map(id => getRawUserByID( id ))
    )).filter((u): u is User => u !== null);
    const noti = await notificationDB.create(title, contents, notiType, users);

    users.forEach((u) => {
    io.to(`notify:${u.id}`).emit("notification:new", noti);
    });

    return noti;
};

export const list = async (userId: number) => {
    const noti = await notificationDB.getByUserId(userId);
    console.log(noti);
    return noti.map(n => ({
        id: n.id!,
        title: n.title!,
        content: n.contents!,      
        createAt: n.sentAt!,   
        isRead: n.isRead!,
    }));
};

export const markRead =  async (notiId: number, userId: number) => {
    return await notificationDB.markRead(notiId);
};

import { AppDataSource } from "../config/database";
import { ENotiType } from "../entity/enum/enum";
import { Notification } from "../entity/Notification";
import { User } from "../entity/User";

const notiRepo = AppDataSource.getRepository(Notification);

export const create = async (title: string, contents: string, notiType: ENotiType, users: User[], href?: string) => {
    const notification = notiRepo.create({title, contents, notiType, users, href});
    return await notiRepo.save(notification);
}

export const getByUserId = async (userId: number) => {
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
}

export const markRead = async (notiId: number) => {
    return await notiRepo.update(
        { id: notiId },
        { isRead: true }
    );
}
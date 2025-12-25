import { Request, Response } from "express";
import * as notificationService from "../services/notification.service";

export const sendNotification = async (req: Request, res: Response) => {
    try {
        const { userIds, title, contents, notiType } = req.body;
        const noti = await notificationService.sendNotification( userIds, title, contents, notiType );
    
        res.status(200).json({
          success: true,
          data: noti,
        });
      } catch {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
}

export const listNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const list = await notificationService.list(userId);

        res.status(200).json({
        success: true,
        data: list,
        });
    } catch {
        res.status(500).json({
        success: false,
        message: "Internal server error",
        });
    }
}
import express from "express";
import * as notiController from "../controllers/notification.controller";
import { verifyToken } from "../middleware/verifyToken";

const notificationRouter = express.Router();

notificationRouter.get("/", verifyToken, notiController.listNotifications);
notificationRouter.post("/", verifyToken, notiController.sendNotification);

export default notificationRouter;

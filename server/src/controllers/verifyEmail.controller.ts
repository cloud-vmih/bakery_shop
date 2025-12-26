import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verify } from "../db/verify.db";

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        if (!token || typeof token !== "string") {
            return res.status(400).json({ error: "Invalid token" });
        }
        const decoded: any = jwt.verify(token as string, process.env.EMAIL_VERIFY_SECRET!);
        const accountId = decoded.id;    
        
        await verify(accountId);
        return res.status(200).json({ message: "Email verified successfully" });
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }   
};
import { Request, Response } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import {as} from "@upstash/redis/zmscore-DhpQcqpW";

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const { accountId, user } = payload
    const newAccessToken = jwt.sign({accountId, user: user}, process.env.JWT_SECRET!, {expiresIn:"7d"})
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

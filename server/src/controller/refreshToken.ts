import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn:"7d"})

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

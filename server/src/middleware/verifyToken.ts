import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  accountId: any,
  user: any
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Lấy token từ header
  const authHeader = req.headers["authorization"];

  // Header kiểu: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Xác thực token
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Gắn thông tin user vào req (để các route sau có thể dùng)
    (req as any).user = decoded.user;

    next(); // Cho đi tiếp
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

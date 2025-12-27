import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  accountId: any;
  user: any;
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Lấy token từ header
  const authHeader = req.headers["authorization"];
  
  // Header kiểu: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    // Không có token = chưa đăng nhập
    return res.status(401).json({
      code: "NO_LOGIN",
      message: "Access denied. No token provided.",
    });
  }

  try {
    // Xác thực token
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    //console.log("Decoded JWT:", decoded);

    // Gắn thông tin user vào req
    (req as any).user = decoded.user;
    next(); // Cho đi tiếp
  } catch (err: any) {
    // Phân biệt các loại lỗi token
    if (err.name === "TokenExpiredError") {
      // Token đã hết hạn
      return res.status(401).json({
        code: "TOKEN_EXPIRED",
        message: "Token has expired. Please refresh or login again.",
      });
    } else if (err.name === "JsonWebTokenError") {
      // Token không hợp lệ
      return res.status(403).json({
        code: "INVALID_TOKEN",
        message: "Invalid token.",
      });
    } else {
      // Lỗi khác
      return res.status(403).json({
        message: "Token verification failed.",
      });
    }
  }
};

export const verifyRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.type) {
      return res.status(401).json({
        code: "NO_USER_INFO",
        message: "Access denied. User information not found.",
      });
    }

    if (!allowedRoles.includes(user.type)) {
      return res.status(403).json({
        code: "FORBIDDEN",
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

export const verifyAdmin = verifyRole("Admin");
export const verifyStaff = verifyRole("Staff");
export const verifyAdminOrStaff = verifyRole("Admin", "Staff");

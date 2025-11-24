// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Lỗi máy chủ';

  console.error(`[${req.method} ${req.path}]`, err); // log đầy đủ

  res.status(status).json({
    error: message,
  });
};
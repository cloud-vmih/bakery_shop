import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import type { ExtendedError } from "socket.io/dist/namespace";

interface JwtPayload {
  accountId: any,
  user: any
}

export const socketAuth = (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  const token = socket.handshake.auth?.token;
  const guestId = socket.handshake.auth?.guestId;
  if (!token && !guestId) {
    return next(new Error("Unauthorized"));
  }

  try {
    if (token) {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return next(new Error("JWT_SECRET not defined"));
      }

      const decoded = jwt.verify(token, secret);

      if (typeof decoded === "string") {
        return next(new Error("Invalid token payload"));
      }

      const payload = decoded as JwtPayload;

      socket.data.user = payload.user;
  
    } else {
      socket.data.user = {
        id: guestId,
        type: "GUEST",
      };
    }

    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
};

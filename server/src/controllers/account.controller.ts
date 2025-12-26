import { Request, Response } from "express";
import { registerUser, loginUser, getUser, googleService, changePassword } from "../services/account.service";
import cron from "node-cron";
import { deletedUserNotVerified } from "../db/account.db";
import { AppDataSource } from "../config/database";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, password2, fullName, email, phoneNumber, dateOfBirth } = req.body;
    if (password !== password2) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const dob = new Date(dateOfBirth);
    const user = await registerUser(username, password, email, phoneNumber, fullName, dob, "");
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

cron.schedule("*/5 * * * *", async () => {
  console.log("Running cleanup job...");
  try {
    await deletedUserNotVerified();
    console.log("Cleanup done!");
  } catch (err) {
    console.error("Cleanup error:", err);
  }
});//Nữa bỏ vào homepage

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);

    res.cookie("refresh_token", result.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
    console.log(err.message);
  }
};


export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await getUser(userId);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
    try {
      const { id_token } = req.body;
      if (!id_token) return res.status(400).json({ message: "id_token missing" });

      const result = await googleService.loginWithGoogle(id_token);
      res.cookie("refresh_token", result.refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      return res.json(result);

    } catch (err) {
      console.error("Google login error:", err);
      return res.status(400).json({ message: "Invalid google token" });
    }
};

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await changePassword.sendOTP(email);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const {email , otp} = req.body;
  try {
    await changePassword.verifyOTP(email, otp)
    res.json({message: "Verify OTP successfully! Change your password now."})
  }
  catch (err: any) {
    res.status(400).json({message: err.message});
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const {password, email} = req.body;
  try {
    const result = await changePassword.resetPassword(password, email);
    res.json(result);
  }
  catch (err: any) {
    res.status(400).json({message: err.message});
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    // Xóa cookie
    res.clearCookie("refresh_token", {
      path: "/api/refresh"
    });

    res.status(200).json({ 
      message: "Logged out successfully" 
    });
  } catch (err: any) {
    console.error("Logout error:", err);
    res.status(500).json({ error: err.message });
  }
};

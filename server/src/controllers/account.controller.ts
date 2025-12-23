import { Request, Response } from "express";
<<<<<<< HEAD
import {
  registerUser,
  loginUser,
  getUser,
  googleService,
} from "../services/account.service";

export const register = async (req: Request, res: Response) => {
  try {
    const {
      username,
      password,
      password2,
      fullName,
      email,
      phoneNumber,
      dateOfBirth,
    } = req.body;
=======
import { registerUser, loginUser, getUser, googleService, changePassword } from "../services/account.service";
import cron from "node-cron";
import { deletedUserNotVerified } from "../db/db.account";
import { AppDataSource } from "../config/database";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, password2, fullName, email, phoneNumber, dateOfBirth } = req.body;
>>>>>>> feature/updateQuantity-v2
    if (password !== password2) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const dob = new Date(dateOfBirth);
<<<<<<< HEAD
    const user = await registerUser(
      username,
      password,
      email,
      phoneNumber,
      fullName,
      dob,
      ""
    );
=======
    const user = await registerUser(username, password, email, phoneNumber, fullName, dob, "");
>>>>>>> feature/updateQuantity-v2
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

<<<<<<< HEAD
=======
cron.schedule("*/5 * * * *", async () => {
  console.log("Running cleanup job...");
  try {
    await deletedUserNotVerified();
    console.log("Cleanup done!");
  } catch (err) {
    console.error("Cleanup error:", err);
  }
});//Nữa bỏ vào homepage

>>>>>>> feature/updateQuantity-v2
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);

<<<<<<< HEAD
=======
    res.cookie("refresh_token", result.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
>>>>>>> feature/updateQuantity-v2
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
    console.log(err.message);
  }
};

<<<<<<< HEAD
=======

>>>>>>> feature/updateQuantity-v2
export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await getUser(userId);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

<<<<<<< HEAD
export const authController = {
  googleLogin: async (req: Request, res: Response) => {
    try {
      const { id_token } = req.body;
      if (!id_token)
        return res.status(400).json({ message: "id_token missing" });

      const result = await googleService.loginWithGoogle(id_token);
      return res.json(result);
=======
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

>>>>>>> feature/updateQuantity-v2
    } catch (err) {
      console.error("Google login error:", err);
      return res.status(400).json({ message: "Invalid google token" });
    }
<<<<<<< HEAD
  },
=======
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
>>>>>>> feature/updateQuantity-v2
};

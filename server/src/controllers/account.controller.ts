import { Request, Response } from "express";
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
    if (password !== password2) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const dob = new Date(dateOfBirth);
    const user = await registerUser(
      username,
      password,
      email,
      phoneNumber,
      fullName,
      dob,
      ""
    );
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);

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

export const authController = {
  googleLogin: async (req: Request, res: Response) => {
    try {
      const { id_token } = req.body;
      if (!id_token)
        return res.status(400).json({ message: "id_token missing" });

      const result = await googleService.loginWithGoogle(id_token);
      return res.json(result);
    } catch (err) {
      console.error("Google login error:", err);
      return res.status(400).json({ message: "Invalid google token" });
    }
  },
};

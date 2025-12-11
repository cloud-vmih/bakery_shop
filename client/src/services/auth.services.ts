import API from "../api/axois.config";
import { AxiosError } from "axios";

interface LoginResponse {
  token: string,
  user: {
    id: number,
    fullName: string,
    email: string,
    type: string,
  }
}

interface RegisterResponse {
  id: number;
  username: string;
  type: string;
}
  


export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const res = await API.post<LoginResponse>("/login", { username, password });
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data?.error || "Đăng nhập thất bại");
  }
};

export const logout = (): void => {
  localStorage.removeItem("token");
};

export const register = async (username: string, password: string, password2: string, fullName: string, email: string, phoneNumber: string, dateOfBirth: string): Promise<RegisterResponse> => {
  try {
    const res = await API.post("/register", { username, password, password2, fullName, email, phoneNumber, dateOfBirth });
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data?.error || "Đăng ký thất bại");
  }
};

export const getUserInfo = async (id: number): Promise<any> => {
  try {
    const res = await API.get(`/user/${id}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data?.error || "Lấy thông tin người dùng thất bại");
  }
};


export const googleLoginService = async (idToken: string) => {
  const res = await API.post(`/google`, { id_token: idToken });
  return res.data; 
};

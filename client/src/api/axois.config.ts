import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

// 🔧 baseURL tự động theo môi trường
const baseURL = process.env.NODE_ENV === "production"
  ? "/api"
  : "http://localhost:5000/api";

// ⚙️ Tạo instance axios
const API = axios.create({
  baseURL,
  withCredentials: true,
});

// 🧠 Interceptor để gắn token vào header
API.interceptors.request.use(
  (req: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        if (req.headers) {
            req.headers.Authorization = `Bearer ${parsedToken}`;
        }
      } catch {
        console.warn("Token in localStorage is not valid JSON");
      }
    }
    return req;
  },
  (error) => Promise.reject(error)
);

export default API;

import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

//baseURL tự động theo môi trường
const baseURL = process.env.NODE_ENV === "production"
  ? process.env.API_URL
  : "http://localhost:5000/api";

//Tạo instance axios
const API = axios.create({
  baseURL,
  withCredentials: true,
});

//Interceptor để gắn token vào header
API.interceptors.request.use(
  (req: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        if (req.headers) {
            req.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        console.warn("Token in localStorage is not valid JSON");
      }
    }
    return req;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;

    // Nếu 401 -> thử refresh
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      const res = await API.post("/auth/refresh");
      const newAccess = res.data.accessToken;

      // Lưu access token mới
      localStorage.setItem("token", newAccess);

      // gắn lại header
      API.defaults.headers.common["Authorization"] = "Bearer " + newAccess;
      original.headers["Authorization"] = "Bearer " + newAccess;

      return API(original);
    }

    return Promise.reject(err);
  }
);

export default API;

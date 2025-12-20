import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

//baseURL tự động theo môi trường
const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
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
  (res) => res,
  (err) => {
    // ❗ KHÔNG refresh token cho request thường
    // ❗ Chỉ đẩy lỗi lên UI xử lý
    return Promise.reject(err);
  }
);

export default API;

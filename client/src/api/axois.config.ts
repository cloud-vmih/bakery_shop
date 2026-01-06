import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:5000/api";

const API = axios.create({
  baseURL,
  withCredentials: true,
});

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
  async (err) => {
    const originalRequest = err.config;

    // Kiểm tra lỗi từ server
    const errorCode = err.response?.data?.code;
    const status = err.response?.status;

    // 1. Lỗi không có quyền (403)
    if (status === 403 && errorCode === "FORBIDDEN") {
      toast.error("Bạn không có quyền truy cập!");
      return Promise.reject(new Error("FORBIDDEN"));
    }

    // 2. Token hết hạn (401 với code TOKEN_EXPIRED)
    if (
      status === 401 &&
      errorCode === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Thử refresh token
        const refreshRes = await API.post("/refresh_token");
        const newAccessToken = refreshRes.data.accessToken;
        // Lưu token mới
        localStorage.setItem("token", newAccessToken);

        // Cập nhật header cho request gốc
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Thực hiện lại request gốc
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại -> về trang login
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(new Error("SESSION_EXPIRED"));
      }
    }

    // 3. Chưa đăng nhập (401 với code NO_LOGIN)
    if (status === 401 && errorCode === "NO_LOGIN") {
      toast.error("Vui lòng đăng nhập để tiếp tục!");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(new Error("NEED_LOGIN"));
    }

    // 4. Token không hợp lệ (403 với code INVALID_TOKEN)
    if (status === 403 && errorCode === "INVALID_TOKEN") {
      toast.error("Phiên đăng nhập không hợp lệ!");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(new Error("INVALID_SESSION"));
    }

    // Xử lý các lỗi khác
    return Promise.reject(err);
  }
);

export default API;
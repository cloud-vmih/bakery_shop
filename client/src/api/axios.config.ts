// src/api/axios.config.ts
import axios from "axios";

// Hardcode baseURL để test (sau này config lại)
const API = axios.create({
  baseURL: "http://localhost:5000/api", // <-- Sửa thành đúng port backend + /api
  withCredentials: true,
});

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Token là string, không cần JSON.parse
      if (req.headers) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }
    return req;
  },
  (error) => Promise.reject(error)
);

export default API;
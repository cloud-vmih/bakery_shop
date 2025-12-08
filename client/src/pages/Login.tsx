import { useState, FormEvent } from "react";
import { login as loginService } from "../services/auth.services";
import toast from "react-hot-toast";
import "../styles/auth.css";
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/authContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
export default function AuthPage() {
  
  const { user, setUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginService(username, password);
      setUser(data.user);
      // Lưu dạng JSON string để interceptor JSON.parse đọc được
      localStorage.setItem("token", JSON.stringify(data.token));
      switch (data.user.type) {
        case "admin":
          navigate(`/admin`);
          break;
        case "staff":
          navigate(`/staff`);
          break;
        default:
          navigate(`/`);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div
        className="auth-card"
      >
        <h2 className="text-3xl font-bold text-cyan-800 mb-2 text-center">
          Đăng nhập
        </h2>
        <p className="text-cyan-600 text-center mb-6 text-sm">
          Chào mừng quay trở lại 
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div className="input-wrapper group">
            <div className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              className="input-box"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="input-wrapper group">
            <div className="input-icon" />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="input-box"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-btn">
            Đăng nhập
          </button>
          <GoogleLoginButton />
        </form>

        <p className="auth-text">
        Chưa có có tài khoản?{" "}
        <a href="/register" className="auth-link">Đăng ký ngay</a>
      </p>
      </div>
    </div>
  );
}

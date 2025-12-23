import { useState, FormEvent } from "react";
import { login as loginService } from "../services/auth.service";
import toast from "react-hot-toast";
import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
export default function AuthPage() {
  const { user, setUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginService(username, password);
      setUser(data.user);
      // Lưu dạng JSON string để interceptor JSON.parse đọc được
      localStorage.setItem("token", data.token);
      setLoading(true);
      setError("");
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
      setError(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="auth-container">
      {/* Background decorations */}
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>
      <div className="floating-shape shape-3"></div>

      <div className="auth-card mb-3">
        <h2>Đăng nhập</h2>
        <p className="text-center mb-3">Chào mừng quay trở lại</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div className="input-wrapper group">
            <div className="input-icon" />
            <input
              type="text"
              placeholder="Tên đăng nhập"
              className="input-box"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div className="input-wrapper group">
            <div className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              className="input-box"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            {/* Nút toggle hiển thị mật khẩu */}
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="forgot-link">
            <a href="/changePW" className="auth-link">
              Quên mật khẩu?
            </a>
          </div>
          <button
            type="submit"
            className="auth-btn"
            disabled={loading || !username || !password}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-green-100"></div>
            <span className="flex-shrink mx-4 text-sm text-gray-400">hoặc</span>
            <div className="flex-grow border-t border-green-100"></div>
          </div>

          <GoogleLoginButton />
        </form>

        <p className="auth-text">
          Chưa có tài khoản?{" "}
          <a href="/register" className="auth-link">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}

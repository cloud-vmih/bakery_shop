import { useState } from "react";
import { FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import { register as registerService } from "../services/auth.services";
import "../styles/auth.css";
import toast from "react-hot-toast";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [errorPassword, setErrorPassword] = useState("");
    const [errorPassword2, setErrorPassword2] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
      e.preventDefault();
      try {
        await registerService(username, password, password2, fullName, email, phoneNumber, dateOfBirth);
        toast.success("Đăng ký thành công!");
        setIsRegister(false);
        setUsername("");
        setPassword("");
        setFullName("");
        setPassword2("");
        setEmail("");
        setPhoneNumber("");
        setDateOfBirth("");
        navigate("/login");
      } catch (err: any) {
        toast.error(err.message);
      }
    };
  const isPasswordStrong = (password: string) => {
  if (!password) return true; // không nhập thì không báo lỗi
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
};
  const isEmailValid = (email: string) => {
    if (!email) return true; // 
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
  <div className="auth-container">
    <div className="auth-card">

      <h2 className="text-3xl font-bold text-cyan-800 mb-2 text-center">Tạo tài khoản</h2>
      <p className="text-cyan-600 text-center mb-6 text-sm">
        Cùng xây dựng hành trình mới nào!
      </p>

      <form onSubmit={handleRegister} className="space-y-6">

        {/* THÔNG TIN TÀI KHOẢN */}
        <div>
          <h3 className="text-lg font-semibold text-cyan-700 mb-2">
            Thông tin tài khoản
          </h3>

          {/* Username */}
          <div className="input-wrapper group mb-3">
            <div className="input-icon" />
            <input
              type="text"
              className="input-box"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="input-wrapper group mb-3">
            <div className="input-icon" />
            <input
              type="password"
              className="input-box"
              placeholder="Mật khẩu"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => {
                if (!isPasswordStrong(password)) {
                  setErrorPassword("Mật khẩu không đủ mạnh (ít nhất 6 ký tự, có chữ hoa và số)");
                  setIsDisabled(true);
                } else {
                  setErrorPassword("");
                  setIsDisabled(false);
                }
              }}
            />
            {errorPassword && (
              <p className="text-red-500 text-sm mt-1">{errorPassword}</p>
            )}
          </div>

          <div className="input-wrapper group mb-3">
            <div className="input-icon" />
            <input
              type="password"
              className="input-box"
              placeholder="Xác nhận lại mật khẩu"
              required
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              onBlur={() => {
                if (password2 !== password && password2 !== "") {
                  setErrorPassword2("Mật khẩu không khớp");
                  setIsDisabled(true);
                } else {
                  setErrorPassword2("");
                  setIsDisabled(false);
                }
              }}
            />
            {errorPassword2 && (
              <p className="text-red-500 text-sm mt-1">{errorPassword2}</p>
            )}
          </div>
        </div>

        {/* THÔNG TIN CÁ NHÂN */}
        <div>
          <h3 className="text-lg font-semibold text-cyan-700 mb-2">
            Thông tin cá nhân
          </h3>

          {/* Full Name */}
          <div className="input-wrapper group mb-3">
            <div className="input-icon" />
            <input
              type="text"
              className="input-box"
              placeholder="Họ và tên"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="input-wrapper group mb-3">
            <div className="input-icon" />
            <input
              type="email"
              className="input-box"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => {
                if (!isEmailValid(email)) {
                  setErrorEmail("Email không hợp lệ");
                  setIsDisabled(true);
                } else {
                  setErrorEmail("");
                  setIsDisabled(false);
                }
              }}
            />
            {errorEmail && (
              <p className="text-red-500 text-sm mt-1">{errorEmail}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="input-wrapper group mb-3">
            <div className="input-icon" />
            <input
              type="tel"
              className="input-box"
              placeholder="Số điện thoại"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* Date of Birth */}
          <div className="input-wrapper group mb-3">
            <div className="input-icon" />
            <input
              type="date"
              className="input-box"
              required
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="auth-btn" disabled={isDisabled}>
          Đăng ký
        </button>
        <GoogleLoginButton />
      </form>

      <p className="auth-text">
        Đã có tài khoản?{" "}
        <a href="/login" className="auth-link">Đăng nhập ngay</a>
      </p>
    </div>
  </div>
);


}

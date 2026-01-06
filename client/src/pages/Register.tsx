import { useState } from "react";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerService } from "../services/auth.service";
import "../styles/auth.css";
import toast from "react-hot-toast";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorPassword2, setErrorPassword2] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await registerService(username, password, password2, fullName, email, phoneNumber, dateOfBirth);
            setLoading(true)
            toast.success("Để hoàn thành đăng ký, hãy bấm link đã được gửi vào email của bạn!");
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
    const isPhoneValid = (phone: string) => {
        if (!phone) return true; //
        return (
            phone.length === 10 &&
            /^[0-9]+$/.test(phone)
        );
    };

    return (
        <div className="auth-container">
            {/* Background decorations */}
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>

            <div className="auth-card">
                <h2 className="text-3xl font-bold text-cyan-800 mb-2 text-center">Tạo tài khoản</h2>
                <p className="text-cyan-750 text-center mb-6 text-sm">
                    Cùng xây dựng hành trình mới nào!
                </p>

                <form onSubmit={handleRegister} className="space-y-6">

                    {/* THÔNG TIN TÀI KHOẢN */}
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-780 mb-2">
                            Thông tin tài khoản
                        </h3>

                        {/* Username */}
                        <div className="input-wrapper group mb-6">
                            <div className="input-icon"/>
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
                        <div className="input-wrapper group mb-6">
                            <div className="input-icon"/>
                            <input
                                type={showPassword ? "text" : "password"}
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
                            {/* Nút toggle hiển thị mật khẩu */}
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600 text-lg"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            {errorPassword && (
                                <p className="text-red-500 text-xs mt-2 absolute top-full left-0 w-full">{errorPassword}</p>
                            )}
                        </div>

                        <div className="input-wrapper group mb-6">
                            <div className="input-icon"/>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
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
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                            {errorPassword2 && (
                                <p className="text-red-500 text-xs mt-2 absolute top-full left-0 w-full">{errorPassword2}</p>
                            )}
                        </div>
                    </div>

                    {/* THÔNG TIN CÁ NHÂN */}
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-780 mb-2">
                            Thông tin cá nhân
                        </h3>

                        {/* Full Name */}
                        <div className="input-wrapper group mb-6">
                            <div className="input-icon"/>
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
                        <div className="input-wrapper group mb-6">
                            <div className="input-icon"/>
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
                                <p className="text-red-500 text-xs mt-2 absolute top-full left-0 w-full">{errorEmail}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div className="input-wrapper group mb-6">
                            <div className="input-icon"/>
                            <input
                                type="tel"
                                className="input-box"
                                placeholder="Số điện thoại"
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                onBlur={() => {
                                    if (!isPhoneValid(phoneNumber)) {
                                        setErrorPhone("Số điện thoại không hợp lệ");
                                        setIsDisabled(true);
                                    } else {
                                        setErrorPhone("");
                                        setIsDisabled(false);
                                    }
                                }}
                            />
                            {errorPhone && (
                                <p className="text-red-500 text-xs mt-2 absolute top-full left-0 w-full">{errorPhone}</p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div className="input-wrapper group mb-6">
                            <div className="input-icon"/>
                            <input
                                type="date"
                                className="input-box"
                                required
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={isDisabled || loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Đang đăng ký...
                            </>
                        ) : (
                            "Đăng ký"
                        )}
                    </button>

                    {/* Divider */}
                    <div className="divider text-center">
                        <span>Hoặc</span>
                    </div>

                    <GoogleLoginButton/>
                </form>

                <p className="auth-text">
                    Đã có tài khoản?{' '}
                    <a href="/login" className="auth-link">Đăng nhập ngay</a>
                </p>
            </div>
        </div>
    );
}
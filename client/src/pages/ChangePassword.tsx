// src/pages/ChangePassword.tsx
import { useState, useEffect } from "react";
import { resetPasswordService } from "../services/auth.service";
import toast from "react-hot-toast";
import '../styles/changePassword.css'; // Import CSS

type Step = "EMAIL" | "OTP" | "RESET";

export default function ChangePassword() {
    const [step, setStep] = useState<Step>("EMAIL");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(30);

    useEffect(() => {
        if (resendCooldown <= 0) return;

        const timer = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCooldown]);

    const isPasswordStrong = (password: string) => {
        if (!password) return true; // không nhập thì không báo lỗi
        return (
            password.length >= 6 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password)
        );
    }

    const getPasswordStrength = (password: string) => {
  if (!password) return { color: '#9ca3af', text: 'Chưa nhập' };
  
  if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    return { color: '#059669', text: 'Mật khẩu mạnh' };
  }
  
  if (password.length >= 6) {
    return { color: '#d97706', text: 'Mật khẩu trung bình' };
  }
  
  return { color: '#dc2626', text: 'Mật khẩu yếu' };
};

    //gửi OTP
    const handleSendOTP = async () => {
        try {
            setLoading(true);
            const data = await resetPasswordService.sendOTP(email);
            setStep("OTP");
            setMsg(data.message);
            setResendCooldown(30);
            toast.success(msg)
        } catch (err: any) {
            setMsg(err.response?.data?.message || "Gửi OTP fail");
        } finally {
            setLoading(false);
        }
    };

    //verify OTP
    const handleVerifyOTP = async () => {
        try {
            setLoading(true);
            const data = await resetPasswordService.verifyOTP(email, otp);
            setStep("RESET");
            setMsg(data.message);
            toast.success(msg)
        } catch (err: any) {
            setMsg(err.response?.data?.message || "OTP sai");
        } finally {
            setLoading(false);
        }
    };

    //reset password
    const handleResetPassword = async () => {
        if (password !== confirm) {
            setMsg("Mật khẩu không khớp");
            return;
        }
        try {
            setLoading(true);
            const data = await resetPasswordService.resetPassword(email, password);
            setMsg(data.message);
        } catch (err: any) {
            setMsg(err.response?.data?.message || "Đổi mật khẩu fail");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            setResendCooldown(30);
            const data = await resetPasswordService.sendOTP(email);
            // restart countdown
            let counter = 30;
            const timer = setInterval(() => {
                counter--;
                setResendCooldown(counter);
                if (counter <= 0) clearInterval(timer);
            }, 1000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Không thể gửi lại OTP");
        }
    };
    const getProgressWidth = () => {
        switch (step) {
            case "EMAIL": return "0%";
            case "OTP": return "50%";
            case "RESET": return "100%";
            default: return "0%";
        }
    };
    return (
        <div className="forgotPasswordPage">
            <div className="forgotPasswordContainer">
                <div className="forgotPasswordCard">
                    {/* Decorative elements */}
                    <div className="cardDecoration"></div>
                    <div className="cardDecoration"></div>

                    <div className="cardHeader">
                        <h1 className="cardTitle">Đổi mật khẩu</h1>
                        <p className="cardSubtitle">Nhập email để nhận mã xác thực OTP</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="progressBar">
                        <div className="progressLine"></div>
                        <div
                            className="progressFill"
                            style={{ width: getProgressWidth() }}
                        ></div>

                        <div className="progressStep">
                            <div className={`stepCircle ${step === "EMAIL" ? 'active' : ''}`}>
                                1
                            </div>
                            <span className={`stepLabel ${step === "EMAIL" ? 'active' : ''}`}>
                                Email
                            </span>
                        </div>

                        <div className="progressStep">
                            <div className={`stepCircle ${step === "OTP" ? 'active' : ''}`}>
                                2
                            </div>
                            <span className={`stepLabel ${step === "OTP" ? 'active' : ''}`}>
                                OTP
                            </span>
                        </div>

                        <div className="progressStep">
                            <div className={`stepCircle ${step === "RESET" ? 'active' : ''}`}>
                                3
                            </div>
                            <span className={`stepLabel ${step === "RESET" ? 'active' : ''}`}>
                                Mật khẩu
                            </span>
                        </div>
                    </div>

                    {/* Messages */}
                    {msg && (
                        <div className={msg.includes("successfully") ? "successMessage" : "errorMessage"}>
                            {msg}
                        </div>
                    )}

                    {/* STEP 1 - EMAIL */}
                    {step === "EMAIL" && (
                        <div className="stepEmail">
                            <div className="inputGroup">
                                <input
                                    type="email"
                                    className="inputField"
                                    placeholder="Nhập email của bạn"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>

                            <button
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="submitButton"
                            >
                                {loading ? (
                                    <>
                                        <span className="loadingSpinner"></span>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    "Gửi mã OTP"
                                )}
                            </button>
                        </div>
                    )}

                    {/* STEP 2 - OTP */}
                    {step === "OTP" && (
                        <div className="stepOTP">
                            <div className="infoMessage">
                                Mã OTP đã được gửi đến {email}
                            </div>

                            <div className="inputGroup">
                                <input
                                    className="inputField"
                                    placeholder="Nhập mã OTP 6 số"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    disabled={loading}
                                    maxLength={6}
                                />
                            </div>

                            <button
                                onClick={handleVerifyOTP}
                                disabled={loading || otp.length !== 6}
                                className="submitButton"
                            >
                                {loading ? (
                                    <>
                                        <span className="loadingSpinner"></span>
                                        Đang xác thực...
                                    </>
                                ) : (
                                    "Xác thực OTP"
                                )}
                            </button>

                            <button
                                onClick={handleResendOTP}
                                disabled={resendCooldown > 0 || loading}
                                className="resendButton"
                            >
                                {resendCooldown > 0
                                    ? `Gửi lại mã sau (${resendCooldown}s)`
                                    : "Gửi lại mã OTP"}
                            </button>
                        </div>
                    )}

                    {/* STEP 3 - RESET PASSWORD */}
                    {step === "RESET" && (
                        <div className="stepReset">
                            <div className="inputGroup relative mb-4">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="inputField"
                                    placeholder="Mật khẩu mới"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    disabled={loading}
                                />
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
                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="passwordStrength">
                                        <div className="strengthBar">
                                            <div
                                                className="strengthFill"
                                                style={{
                                                    width: `${Math.min(password.length * 10, 100)}%`,
                                                    backgroundColor: password.length >= 8 ? '#10b981' : password.length >= 6 ? '#f59e0b' : '#ef4444'
                                                }}
                                            ></div>
                                        </div>
                                        <div className="strengthText" style={{
                                            color: password.length >= 8 ? '#059669' : password.length >= 6 ? '#d97706' : '#dc2626'
                                        }}>
                                            {password.length >= 8 ? 'Mật khẩu mạnh' : password.length >= 6 ? 'Mật khẩu trung bình' : 'Mật khẩu yếu'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="inputGroup relative mb-4">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="inputField"
                                    placeholder="Xác nhận mật khẩu"
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    disabled={loading}
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

                                {confirm && password !== confirm && (
                                    <div className="errorMessage" style={{ marginTop: '0.5rem' }}>
                                        Mật khẩu không khớp
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleResetPassword}
                                disabled={loading || !password || !confirm || password !== confirm}
                                className="submitButton"
                            >
                                {loading ? (
                                    <>
                                        <span className="loadingSpinner"></span>
                                        Đang đổi mật khẩu...
                                    </>
                                ) : (
                                    "Đổi mật khẩu"
                                )}
                            </button>
                        </div>
                    )}

                    {/* Back to Login */}
                    <div className="backToLogin">
                        <a href="/login" className="backLink">
                            ← Quay lại trang đăng nhập
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};


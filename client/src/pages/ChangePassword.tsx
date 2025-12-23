// src/pages/ChangePassword.tsx
import { useState, useEffect } from "react";
import { resetPasswordService } from "../services/auth.service";
import toast from "react-hot-toast";
import "../styles/changePassword.css"; // Import CSS

type Step = "EMAIL" | "OTP" | "RESET";

export default function ChangePassword() {
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
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
      password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password)
    );
  };
  //gửi OTP
  const handleSendOTP = async () => {
    try {
      setLoading(true);
      const data = await resetPasswordService.sendOTP(email);
      setStep("OTP");
      setMsg(data.message);
      setResendCooldown(30);
      toast.success(msg);
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
      toast.success(msg);
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
      case "EMAIL":
        return "0%";
      case "OTP":
        return "50%";
      case "RESET":
        return "100%";
      default:
        return "0%";
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
              <div className={`stepCircle ${step === "EMAIL" ? "active" : ""}`}>
                1
              </div>
              <span className={`stepLabel ${step === "EMAIL" ? "active" : ""}`}>
                Email
              </span>
            </div>

            <div className="progressStep">
              <div className={`stepCircle ${step === "OTP" ? "active" : ""}`}>
                2
              </div>
              <span className={`stepLabel ${step === "OTP" ? "active" : ""}`}>
                OTP
              </span>
            </div>

            <div className="progressStep">
              <div className={`stepCircle ${step === "RESET" ? "active" : ""}`}>
                3
              </div>
              <span className={`stepLabel ${step === "RESET" ? "active" : ""}`}>
                Mật khẩu
              </span>
            </div>
          </div>

          {/* Messages */}
          {msg && (
            <div
              className={
                msg.includes("successfully") ? "successMessage" : "errorMessage"
              }
            >
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
                  onChange={(e) => setEmail(e.target.value)}
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
              <div className="infoMessage">Mã OTP đã được gửi đến {email}</div>

              <div className="inputGroup">
                <input
                  className="inputField"
                  placeholder="Nhập mã OTP 6 số"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
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
              <div className="inputGroup">
                <input
                  type="password"
                  className="inputField"
                  placeholder="Mật khẩu mới"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />

                {/* Password Strength Indicator */}
                {password && (
                  <div className="passwordStrength">
                    <div className="strengthBar">
                      <div
                        className="strengthFill"
                        style={{
                          width: `${Math.min(password.length * 10, 100)}%`,
                          backgroundColor:
                            password.length >= 8
                              ? "#10b981"
                              : password.length >= 6
                              ? "#f59e0b"
                              : "#ef4444",
                        }}
                      ></div>
                    </div>
                    <div
                      className="strengthText"
                      style={{
                        color:
                          password.length >= 8
                            ? "#059669"
                            : password.length >= 6
                            ? "#d97706"
                            : "#dc2626",
                      }}
                    >
                      {password.length >= 8
                        ? "Mật khẩu mạnh"
                        : password.length >= 6
                        ? "Mật khẩu trung bình"
                        : "Mật khẩu yếu"}
                    </div>
                  </div>
                )}
              </div>

              <div className="inputGroup">
                <input
                  type="password"
                  className="inputField"
                  placeholder="Xác nhận mật khẩu"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={loading}
                />

                {confirm && password !== confirm && (
                  <div className="errorMessage" style={{ marginTop: "0.5rem" }}>
                    Mật khẩu không khớp
                  </div>
                )}
              </div>

              <button
                onClick={handleResetPassword}
                disabled={
                  loading || !password || !confirm || password !== confirm
                }
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
}

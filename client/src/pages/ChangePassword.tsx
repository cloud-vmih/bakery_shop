// src/pages/ChangePassword.tsx
import { useState } from "react";
import { resetPasswordService } from "../services/auth.services";

type Step = "EMAIL" | "OTP" | "RESET";

export default function ChangePassword() {
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  //gửi OTP
  const handleSendOTP = async () => {
    try {
      setLoading(true);
      const data = await resetPasswordService.sendOTP(email);
      setStep("OTP");
      setMsg(data.message);
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

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Đổi mật khẩu</h2>

      {msg && <p className="text-sm mb-3 text-red-500">{msg}</p>}

      {/* STEP 1 */}
      {step === "EMAIL" && (
        <>
          <input
            className="w-full border p-2 rounded mb-3"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Gửi OTP
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === "OTP" && (
        <>
          <input
            className="w-full border p-2 rounded mb-3"
            placeholder="Nhập OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Xác thực OTP
          </button>
        </>
      )}

      {/* STEP 3 */}
      {step === "RESET" && (
        <>
          <input
            type="password"
            className="w-full border p-2 rounded mb-3"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="w-full border p-2 rounded mb-3"
            placeholder="Xác nhận mật khẩu"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-purple-600 text-white p-2 rounded"
          >
            Đổi mật khẩu
          </button>
        </>
      )}
    </div>
  );
}

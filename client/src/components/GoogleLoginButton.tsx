import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { googleLoginService } from "../services/auth.service";
import { useUser } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSocketStore } from "../stores/socket.store";

export default function GoogleLoginButton() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          const idToken = credentialResponse.credential;
          if (!idToken) return toast.error("Google không trả id_token!");

          const data = await googleLoginService(idToken);

          setUser(data.user);
          if (data.token) {
            localStorage.setItem("token", data.token);
            useSocketStore.getState().reconnectSocket();
          }
          toast.success("Đăng nhập Google thành công!");
          switch (data.user.type) {
              case "Admin":
                  navigate(`/admin/menu`);
                  break;
              case "Staff":
                  navigate(`/admin`);
                  break;
              default:
                  navigate(`/`);
            }
        } catch (err: any) {
          toast.error("Đăng nhập Google thất bại");
        }
      }}
      onError={() => toast.error("Google Login lỗi rồi ba!")}
    />
  );
}

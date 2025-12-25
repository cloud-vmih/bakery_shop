import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { googleLoginService } from "../services/auth.services";
import { useUser } from "../context/authContext";
import { useNavigate } from "react-router-dom";

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

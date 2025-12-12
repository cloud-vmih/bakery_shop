import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { verifyEmail } from "../services/email.service";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      toast.error("Token missing");
      return;
    }

    verifyEmail(token)
      .then((data) => {
        toast.success(data.message);
        navigate("/login");
      })
      .catch((error: any) => {
        toast.error(error);
      });
  }, []);

  return <p>Verifying email...</p>;
}

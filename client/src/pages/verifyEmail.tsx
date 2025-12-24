import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/axios.config";
import { toast } from "react-hot-toast";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      toast.error("Token missing");
      return;
    }

    API.get(`/verify-email?token=${token}`)
      .then(() => {
        toast.success("Email verified! You can now login.");
        navigate("/login");
      })
      .catch(() => {
        toast.error("Invalid or expired token.");
      });
  }, []);

  return <p>Verifying email...</p>;
}

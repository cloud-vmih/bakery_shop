import toast from "react-hot-toast";
import { useUser } from "../context/AuthContext";
import { useEffect } from "react";
import { Header } from "../components/Header";

const HomePage = () => {
  const { user } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (user) {
      toast.success(
        "Chào mừng " + user.fullName + " (" + user.type + ") trở lại trang chủ!"
      );
    }
  }, [user]);

  return (
    <>
      <div>Trang chủ</div>;
    </>
  );
};

export default HomePage;

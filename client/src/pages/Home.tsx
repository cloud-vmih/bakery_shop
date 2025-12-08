import toast from "react-hot-toast";
import { useUser } from "../context/authContext";
import { useEffect } from "react";
import { Header } from "../components/Header";

const HomePage = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      toast.success("Chào mừng " + user.fullName + " (" + user.type + ") trở lại trang chủ!");
    }
  }, [user]);

  return (
    <>
      <Header user={user}/>
      <div>Trang chủ</div>;
    </>
  )
};

export default HomePage;
import toast from "react-hot-toast";
import { useUser } from "../context/authContext";
import { useEffect } from "react";

const ProductDetails = () => {
  const { user } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    if (user) {
      toast.success("Chào mừng " + user.fullName + " (" + user.type + ") trở lại trang chủ!");
    }
  }, [user]);

  return (
    <>
      <div>Chi tiết sản phẩm</div>;
    </>
  )
};

export default ProductDetails;
import toast from "react-hot-toast";

export const getSocketAuth = () => {
  const token = localStorage.getItem("token");

  if (token) {
    toast.success("tpk")
    return { token };
  }

  let guestId = localStorage.getItem("guestID");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guestID", guestId);
  }

  return { guestId };
};

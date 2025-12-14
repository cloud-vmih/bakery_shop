import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { verifyToken } from "../services/auth.services"; // FE gọi /token BE

interface AuthContextType {
  user: any | null;
  setUser: (user: any) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // đỡ gọi API thừa

      try {
        const data = await verifyToken();
         // FE sẽ tự gửi token bằng headers
        setUser(data.user); // BE trả user/info
      } catch (err) {
        console.log("Token lỗi, clear luôn user");
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};

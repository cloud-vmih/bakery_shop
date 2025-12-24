import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { verifyToken } from "../services/auth.service"; // FE gọi /token BE

interface AuthContextType {
  user: any | null;
  setUser: (user: any | null) => void;
  logout: () => void; // 👈 THÊM
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const data = await verifyToken(); // FE sẽ tự gửi token bằng headers
        setUser(data.user); // BE trả user/info
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};

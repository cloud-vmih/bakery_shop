import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { verifyToken } from "../services/auth.service";

/* ================= TYPES ================= */

interface AuthContextType {
  user: any | null;
  setUser: (user: any | null) => void;
  logout: () => void; // 🔥 THÊM
  loading: boolean; // 🔥 optional nhưng RẤT NÊN CÓ
}

/* ================= CONTEXT ================= */

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- INIT AUTH ---------- */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await verifyToken(); // token auto attach
        setUser(data.user);
      } catch (err) {
        console.log("Token lỗi → logout");
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null); // 🔥 QUAN TRỌNG NHẤT
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useUser = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useUser must be used inside AuthProvider");
  }
  return ctx;
};

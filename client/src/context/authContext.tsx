import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
  user: any | null;
  setUser: (user: any) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);

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
// import { createContext, useState, useContext, ReactNode } from "react";
// import API from "../api/axois.config";

// interface UserContextType {
//   user: any;
//   token: string | null;
//   getUserInfo: (id: number) => Promise<void>;
// }
// const UserContext = createContext<UserContextType | undefined>(undefined);
// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<any>(null);
//   const [token, setToken] = useState<string | null>(null);

//   const getUserInfo = async (id: number) => {
//     const res = await API.get(`/user/${id}`);
//     setUser(res.data);
//   };
//     return (
//     <UserContext.Provider value={{ user, token, getUserInfo }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const ctx = useContext(UserContext);
//   if (!ctx) throw new Error("useUser must be used inside UserProvider");
//   return ctx;
// };
// src/layouts/AuthLayout.tsx
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 p-5">
      {/* blur effect */}
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}


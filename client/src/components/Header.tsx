import * as React from "react";
import { Menu as MenuIcon, X as XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/authContext"
import { Link } from "react-router-dom";

type User = {
  fullName: string;
  avatar: string;
};

type HeaderProps = {
  user?: User | null; // null = chưa đăng nhập
  onLogin?: () => void;
  onLogout?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onLogin, onLogout }) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  console.log("USER VALUE:", user);

if (user) {
  console.log("USER FULLNAME:", user.fullName);
  console.log("USER FULLNAME TYPE:", typeof user.fullName);
  console.log("USER FULLNAME HAS $$typeof:", user.fullName?.$$typeof);

  console.log("USER IS REACT ELEMENT:", !!user?.$$typeof);
}

  // Default onLogin nếu cha không truyền vào
  const handleLogin = onLogin ?? (() => navigate("/login"));

  const handleLogout = onLogout ?? (() => {
    localStorage.removeItem("token");
    navigate("/login");
  });

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 cursor-pointer">
          MyApp
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 text-sm">

          <Link to="#" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/menu" className="hover:text-blue-600 transition">Menu</Link>
          <Link to="#" className="hover:text-blue-600 transition">About Us</Link>

          {/* === Switch Login / User === */}
          {!user ? (
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-2 cursor-pointer relative group">
              <img
                src={user.avatar}
                className="w-9 h-9 rounded-full border"
              />
              <span className="font-medium">{user.fullName}</span>

              {/* Dropdown */}
              <div className="absolute hidden group-hover:flex flex-col right-0 mt-10 bg-white shadow-md rounded-lg w-32 py-2">
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <><XIcon size={26} /></> : <><MenuIcon size={26} /></>}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-sm">
          <nav className="flex flex-col gap-4 px-6 py-4 text-gray-700 text-sm">
            <Link to="#" className="hover:text-blue-600 transition">Home</Link>
            <Link to="/menu" className="hover:text-blue-600 transition">Menu</Link>
            <Link to="#" className="hover:text-blue-600 transition">About us</Link>

            {/* Mobile Switch */}
            {!user ? (
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={user.avatar}
                  className="w-10 h-10 rounded-full border"
                />
                <span className="font-medium">{user.fullName}</span>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

import * as React from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import RequireAuthModal from "../components/RequireAuthModal";

type User = {
  fullName: string;
  avatar: string;
};

type HeaderProps = {
  user?: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onLogin, onLogout }) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { totalItems } = useCart();

  // Default handlers
  const handleLogin = onLogin ?? (() => navigate("/login"));

  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const handleLogout =
    onLogout ??
    (() => {
      logout();
      navigate("/login");
    });

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    navigate("/cart");
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-blue-600 cursor-pointer"
        >
          MyApp
        </div>

        {/* ================= Desktop Nav ================= */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 text-sm">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/menu" className="hover:text-blue-600 transition">
            Menu
          </Link>
          <Link to="#" className="hover:text-blue-600 transition">
            About Us
          </Link>

          {/* 🛒 Giỏ hàng */}
          <button
            onClick={handleCartClick}
            className="relative flex items-center gap-1 hover:text-blue-600 transition"
          >
            <ShoppingCart size={18} />

            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}

            <span>Giỏ hàng</span>
          </button>

          {/* Login / User */}
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
                alt={user.fullName}
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

        {/* ================= Mobile Toggle ================= */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* ================= Mobile Menu ================= */}
      {open && (
        <div className="md:hidden bg-white shadow-sm">
          <nav className="flex flex-col gap-4 px-6 py-4 text-gray-700 text-sm">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Home
            </Link>

            <Link
              to="/menu"
              onClick={() => setOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Menu
            </Link>

            <Link
              to="#"
              onClick={() => setOpen(false)}
              className="hover:text-blue-600 transition"
            >
              About Us
            </Link>

            {/* 🛒 Giỏ hàng */}
            <button
              onClick={(e) => {
                setOpen(false);
                handleCartClick(e);
              }}
              className="flex items-center gap-2 hover:text-blue-600 transition"
            >
              <ShoppingCart size={18} />
              Giỏ hàng
            </button>

            {/* Mobile Login / User */}
            {!user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogin();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full border"
                />
                <span className="font-medium">{user.fullName}</span>
              </div>
            )}
          </nav>
        </div>
      )}
      <RequireAuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
};

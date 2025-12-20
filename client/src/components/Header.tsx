import * as React from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/authContext"
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from "react-router-dom";

type User = {
  fullName: string;
  avatar: string;
};

type HeaderProps = {
  viewProfile?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ viewProfile, onLogin, onLogout }) => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  // Default onLogin nếu cha không truyền vào
  const handleLogin = onLogin ?? (() => navigate("/login"));

  const handleLogout = onLogout ?? (() => {
    localStorage.removeItem("token");
    navigate("/login");
  });


  const handleViewProfile = viewProfile ?? (() => {
    navigate("/profile");
  });

    return (
        <header className="w-full bg-gradient-to-r from-white to-emerald-50/30 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-emerald-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

                {/* Logo với gradient */}
                <Link
                    to="/"
                    className="flex items-center gap-2 group cursor-pointer"
                >
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-xl opacity-20 group-hover:opacity-30 blur transition-opacity"></div>
                    </div>
                    <div className="flex flex-col">
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
            MyBakery
          </span>
                        <span className="text-xs text-emerald-500 font-medium -mt-1">
            Fresh & Delicious
          </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/"
                            className="relative group px-3 py-2 text-emerald-800 font-medium text-sm transition-all duration-300 hover:text-emerald-600"
                        >
                            <span className="relative z-10">Home</span>
                            <span className="absolute inset-0 bg-emerald-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                        </Link>

                        <Link
                            to="/menu"
                            className="relative group px-3 py-2 text-emerald-800 font-medium text-sm transition-all duration-300 hover:text-emerald-600"
                        >
                            <span className="relative z-10">Menu</span>
                            <span className="absolute inset-0 bg-emerald-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                        </Link>

                        <Link
                            to="/about"
                            className="relative group px-3 py-2 text-emerald-800 font-medium text-sm transition-all duration-300 hover:text-emerald-600"
                        >
                            <span className="relative z-10">About Us</span>
                            <span className="absolute inset-0 bg-emerald-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                        </Link>

                        <Link
                            to="/contact"
                            className="relative group px-3 py-2 text-emerald-800 font-medium text-sm transition-all duration-300 hover:text-emerald-600"
                        >
                            <span className="relative z-10">Contact</span>
                            <span className="absolute inset-0 bg-emerald-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                        </Link>
                    </div>

                    {/* User Section */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/cart"
                            className="relative p-2 rounded-full hover:bg-emerald-50 transition-colors inline-block"
                        >
                            <span className="fas fa-shopping-cart text-lg text-emerald-600"></span>
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
    3
  </span>
                        </Link>

                        {/* User Profile / Login */}
                        {!user ? (
                            <Link
                                to="/login"
                                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 group"
                            >
                                <span className="fas fa-key text-lg"></span>
                                <span>Login</span>
                            </Link>
                        ) : (
                            <div className="relative group">
                                <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50 transition-all duration-300 group">
                                    <div className="relative">
                                        <img
                                            src={user.avatar || "https://via.placeholder.com/40"}
                                            alt={user.fullName}
                                            className="w-10 h-10 rounded-full border-2 border-emerald-200 object-cover shadow-sm"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://via.placeholder.com/40";
                                            }}
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex flex-col items-start">
                                      <span className="font-semibold text-emerald-900 text-sm">
                                        {user.fullName || user.username}
                                      </span>
                                        <span className="text-xs text-emerald-600">
                                            {user.type === 'ADMIN' ? 'Administrator' : 'Member'}
                                          </span>
                                    </div>
                                    <svg className="w-4 h-4 text-emerald-500 transform group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-2 w-56 origin-top-right scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 transform-gpu">
                                    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-emerald-100 overflow-hidden py-2">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-emerald-100">
                                            <p className="font-semibold text-emerald-900">{user.fullName}</p>
                                            <p className="text-xs text-emerald-600 mt-1">{user.email}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors group/item"
                                        >
                                            <span className="fas fa-user text-lg"></span>
                                            <span>My Profile</span>
                                        </Link>

                                        <Link
                                            to="/orders"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors group/item"
                                        >
                                            <span className="fas fa-box text-lg"></span>
                                            <span>My Orders</span>
                                        </Link>

                                        {user.type === 'ADMIN' && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-amber-700 hover:bg-amber-50 transition-colors group/item"
                                            >
                                                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        )}

                                        <div className="border-t border-emerald-100 mt-2 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full group/item"
                                            >
                                                <span className="fas fa-sign-out-alt text-lg"></span>
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="lg:hidden p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                    aria-label="Toggle menu"
                >
                    {open ? (
                        <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-emerald-100 animate-slideDown">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                        <nav className="flex flex-col gap-1">
                            <Link
                                to="/"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-50 text-emerald-800 font-medium transition-colors group"
                                onClick={() => setOpen(false)}
                            >
                                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Home</span>
                            </Link>

                            <Link
                                to="/menu"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-50 text-emerald-800 font-medium transition-colors group"
                                onClick={() => setOpen(false)}
                            >
                                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>Menu</span>
                            </Link>

                            <Link
                                to="/about"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-50 text-emerald-800 font-medium transition-colors group"
                                onClick={() => setOpen(false)}
                            >
                                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>About Us</span>
                            </Link>

                            <Link
                                to="/contact"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-50 text-emerald-800 font-medium transition-colors group"
                                onClick={() => setOpen(false)}
                            >
                                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>Contact</span>
                            </Link>

                            {/* Mobile User Section */}
                            <div className="border-t border-emerald-100 mt-3 pt-4">
                                {!user ? (
                                    <Link
                                        to="/login"
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-md transition-all"
                                        onClick={() => setOpen(false)}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Login / Register</span>
                                    </Link>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-lg mb-3">
                                            <img
                                                src={user.avatar || "https://via.placeholder.com/40"}
                                                alt={user.fullName}
                                                className="w-12 h-12 rounded-full border-2 border-emerald-200 object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-emerald-900">{user.fullName}</p>
                                                <p className="text-xs text-emerald-600">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Link
                                                to="/profile"
                                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                                                onClick={() => setOpen(false)}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Profile
                                            </Link>

                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setOpen(false);
                                                }}
                                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
    }
import * as React from "react";
import { Menu as MenuIcon, X as XIcon } from "lucide-react";
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
                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        {[
                            // Link cho Admin/Staff
                            { to: "/admin", label: "Dashboard", types: ['Admin', 'Staff'] },
                            { to: "/admin/menu", label: "Menu", types: ['Admin'] },
                            { to: "/admin/branch", label: "Branch", types: ['Admin', 'Staff'] },
                            { to: "/admin/promotion", label: "Promotion", types: ['Admin', 'Staff'] },

                            // Link chỉ cho Admin
                            { to: "/admin/staff", label: "Staff", types: ['Admin'] },

                            // Link chỉ cho customer
                            { to: "/", label: "Home", types: ['Customer'] },
                            { to: "/menu", label: "Menu", types: ['Customer', 'Staff'] },
                            { to: "/about", label: "About Us", types: ['Customer'] },
                            { to: "/contact", label: "Contact", types: ['Customer'] },
                        ]
                            .filter(link => link.types.includes(user?.type || ''))
                            .map((link, index) => (
                                <Link
                                    key={index}
                                    to={link.to}
                                    className="relative group px-3 py-2 text-emerald-800 font-medium text-sm transition-all duration-300 hover:text-emerald-600"
                                >
                                    <span className="relative z-10">{link.label}</span>
                                    <span className="absolute inset-0 bg-emerald-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                                </Link>
                            ))}
                    </div>

                    {/* User Section */}
                    <div className="flex items-center gap-4">
                        {user?.type === 'Customer' && (
                        <Link
                            to="/cart"
                            className="relative p-2 rounded-full hover:bg-emerald-50 transition-colors inline-block"
                        >
                            <span className="fas fa-shopping-cart text-lg text-emerald-600"></span>
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
    3
  </span>
                        </Link>
                        )}
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
                                            src={user.avatarURL || "https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?cs=srgb&dl=pexels-pixabay-104827.jpg&fm=jpg"}
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
                                            {user.type === 'Admin' ? 'Administrator' : 'Member'}
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

                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors group/item"
                                        >
                                            <span className="fas fa-user text-lg"></span>
                                            <span>My Profile</span>
                                        </Link>
                                        {user.type === 'Customer' && (
                                            <>
                                        <Link
                                            to="/order"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors group/item"
                                        >
                                            <span className="fas fa-box text-lg"></span>
                                            <span>My Orders</span>
                                        </Link>

                                        <Link
                                            to="/wishlist"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors group/item"
                                        >
                                            <span className="fas fa-heart text-lg"></span>
                                            <span>My Wishlist</span>
                                        </Link>
                                            </>
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
                            {[
                                // Link luôn hiển thị (Menu)
                                { to: user?.type === 'Admin' ? "/admin/menu" : "/menu", label: "Menu", icon: "fa-utensils" },

                                // Link cho Admin/Staff
                                ...(user?.type === 'Admin' || user?.type === 'Staff' ? [
                                    { to: "/admin", label: "Dashboard", icon: "fa-chart-line" },
                                    { to: "/admin/branch", label: "Branch", icon: "fa-store" },
                                    { to: "/admin/promotion", label: "Promotion", icon: "fa-tag" },
                                ] : []),

                                // Link chỉ cho Admin
                                ...(user?.type === 'Admin' ? [
                                    { to: "/admin/staff", label: "Staff", icon: "fa-users" },
                                ] : []),

                                // Link chỉ cho Customer
                                ...(user?.type === 'Customer' ? [
                                    { to: "/", label: "Home", icon: "fa-home" },
                                    { to: "/about", label: "About Us", icon: "fa-info-circle" },
                                    { to: "/contact", label: "Contact", icon: "fa-envelope" },
                                ] : []),

                                // Cart chỉ cho Customer
                                ...(user?.type === 'Customer' ? [
                                    { to: "/cart", label: "Cart (3)", icon: "fa-shopping-cart" },
                                ] : []),
                            ].map((link, index) => (
                                <Link
                                    key={index}
                                    to={link.to}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-50 text-emerald-800 font-medium transition-colors group"
                                    onClick={() => setOpen(false)}
                                >
                                    <span className={`${link.icon} text-emerald-500 w-5 text-center`}></span>
                                    <span>{link.label}</span>
                                </Link>
                            ))}

                            {/* Mobile User Section */}
                            <div className="border-t border-emerald-100 mt-3 pt-4">
                                {!user ? (
                                    <Link
                                        to="/login"
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-md transition-all"
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className="fas fa-key"></span>
                                        <span>Login / Register</span>
                                    </Link>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-lg mb-3">
                                            <div className="w-12 h-12 rounded-full border-2 border-emerald-200 bg-emerald-100 flex items-center justify-center">
                                                <span className="fas fa-user text-xl text-emerald-600"></span>
                                            </div>
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
                                                <span className="fas fa-user"></span>
                                                Profile
                                            </Link>

                                            {/* Customer specific links trên mobile */}
                                            {user.type === 'Customer' && (
                                                <>
                                                    <Link
                                                        to="/order"
                                                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <span className="fas fa-box"></span>
                                                        Orders
                                                    </Link>
                                                    <Link
                                                        to="/wishlist"
                                                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <span className="fas fa-heart"></span>
                                                        Wishlist
                                                    </Link>
                                                </>
                                            )}

                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setOpen(false);
                                                }}
                                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <span className="fas fa-sign-out-alt"></span>
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
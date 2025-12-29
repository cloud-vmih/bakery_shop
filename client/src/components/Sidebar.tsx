import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";

export const AdminSidebar = () => {
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const {user} = useUser()
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Danh sách menu dành cho Admin/Staff
    const adminMenuItems = [
        {to: "/admin", label: "Dashboard", icon: "fas fa-chart-line", types: ['Admin', 'Staff']},
        {to: "/admin/menu", label: "Menu Management", icon: "fas fa-utensils", types: ['Admin', 'Staff']},
        {to: "/admin/branch", label: "Branch Management", icon: "fas fa-store", types: ['Admin', 'Staff']},
        {to: "/admin/promotion", label: "Promotions", icon: "fas fa-tag", types: ['Admin']},
        {to: "/admin/reviews", label: "Customer Reviews", icon: "fas fa-star", types: ['Admin', 'Staff']},
        {to: "/admin/staff", label: "Staff Management", icon: "fas fa-users-cog", types: ['Admin']},
        {to: "/admin/manage-orders", label: "Orders", icon: "fas fa-shopping-bag", types: ['Admin', 'Staff']},
    ];

    const menuItems = adminMenuItems.filter(item => {
        if (!user) return false;
        return item.types.includes(user.type || '');
    });

    return (
        <>
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700 transition-colors"
            >
                <span className="fas fa-bars text-lg"></span>
            </button>

            {/* Sidebar Overlay cho mobile */}
            {isSidebarCollapsed && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarCollapsed(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
            fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40
            ${isSidebarCollapsed ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            w-64 lg:w-72 h-screen
            bg-gradient-to-b from-emerald-50 to-white
            border-r border-emerald-100
            shadow-xl lg:shadow-lg
            transition-transform duration-300 ease-in-out
            flex flex-col
            overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-transparent
        `}>

                {/* Logo và Brand */}
                <div
                    className="p-6 border-b border-emerald-100 bg-gradient-to-r from-white to-emerald-50/50 sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <Link to="/admin" className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                                <span className="fas fa-shield-alt text-white text-xl"></span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-emerald-900">Admin Panel</h1>
                                <p className="text-xs text-emerald-600">{user?.type || 'Staff'}</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setIsSidebarCollapsed(false)}
                            className="lg:hidden p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                            <span className="fas fa-times text-emerald-600"></span>
                        </button>
                    </div>
                </div>

                {/* User Profile Summary */}
                <div className="p-4 border-b border-emerald-100 bg-white sticky top-[88px] z-10">
                    <div
                        className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-emerald-100">
                        <img
                            src={user?.avatarURL || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.fullName || 'Admin') + "&background=10b981&color=fff"}
                            alt={user?.fullName}
                            className="w-12 h-12 rounded-full border-2 border-emerald-200 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-emerald-900 truncate">{user?.fullName || 'Administrator'}</h3>
                            <p className="text-xs text-emerald-600 truncate">{user?.type === 'Admin' ? 'Administrator' : 'Staff Member'}</p>
                        </div>
                        <span
                            className={`w-3 h-3 rounded-full ${user?.type === 'Admin' ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.to;

                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setIsSidebarCollapsed(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                ${isActive
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md'
                                        : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 hover:shadow-sm'
                                    }
                                `}
                                >
                                <span
                                    className={`text-lg w-6 text-center ${isActive ? 'text-white' : 'text-emerald-500'}`}>
                                    <i className={item.icon}></i>
                                </span>
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Divider */}
                    <div className="my-6 border-t border-emerald-100 pt-6">
                        <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 px-4">
                            Quick Links
                        </h3>
                        <div className="space-y-1">
                            <Link
                                to="/"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                            >
                                <span className="fas fa-home text-emerald-500"></span>
                                <span>View Website</span>
                            </Link>
                            <Link
                                to="/menu"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                            >
                                <span className="fas fa-utensils text-emerald-500"></span>
                                <span>Public Menu</span>
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-emerald-100 bg-white sticky bottom-0 z-10">
                    <div className="space-y-2">
                        <Link
                            to="/admin/profile"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                            <span className="fas fa-user-circle text-emerald-500"></span>
                            <span>My Profile</span>
                        </Link>
                        <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                            <span className="fas fa-cog text-emerald-500"></span>
                            <span>Settings</span>
                        </Link>
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsSidebarCollapsed(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                            <span className="fas fa-sign-out-alt"></span>
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Version info */}
                    <div className="mt-4 pt-4 border-t border-emerald-100 text-center">
                        <p className="text-xs text-emerald-400">v2.1.0 • Admin Panel</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
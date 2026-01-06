// src/layouts/AdminLayout.tsx
import { AdminSidebar } from '../components/Sidebar';
import { Outlet } from 'react-router-dom';


export const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <AdminSidebar />

                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>

            </div>
        </div>
    );
};
import { Header } from '../components/Header';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-emerald-50/20">
            <Header/>

            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-emerald-900 text-white py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Footer content */}
                </div>
            </footer>
        </div>
    );
};
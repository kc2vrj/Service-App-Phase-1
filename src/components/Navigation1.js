import React from 'react';
import Link from 'next/link';
import { Users, Clock, LogOut, Calendar, FileText, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

const Navigation = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    
    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    
    return (
        <header className="bg-primary supports-[backdrop-filter]:bg-primary/80 backdrop-blur sticky top-0 z-50 shadow-soft-md">
            <div className="content-width">
                <div className="flex justify-between items-center h-20">
                    {/* Main Navigation */}
                    <nav className="flex-grow flex items-center">
                        <Link href="/" className="flex items-center hover-lift mr-8">
                            <img
                               src="/maytech-logo.jpg"
                               alt="Maytech Systems"
                               width="500" 
                               height="128"
                               className="h-12 w-auto"
                            />
                        </Link>
                        
                        <Link
                            href="/timesheet-daily"
                            className={`flex items-center px-4 py-2.5 text-primary-foreground hover:bg-white/10 rounded-md transition-all duration-200 hover-lift ${
                                router.pathname === '/timesheet-daily' ? 'bg-white/10' : ''
                            }`}
                        >
                            <Clock className="w-4 h-4 mr-2.5" />
                            <span className="text-sm font-medium">Daily View</span>
                        </Link>

                        <Link
                            href="/timesheet-weekly"
                            className={`flex items-center px-4 py-2.5 text-primary-foreground hover:bg-white/10 rounded-md transition-all duration-200 hover-lift ${
                                router.pathname === '/timesheet-weekly' ? 'bg-white/10' : ''
                            }`}
                        >
                            <Calendar className="w-4 h-4 mr-2.5" />
                            <span className="text-sm font-medium">Weekly View</span>
                        </Link>

                        <Link
                            href="/quotes"
                            className={`flex items-center px-4 py-2.5 text-primary-foreground hover:bg-white/10 rounded-md transition-all duration-200 hover-lift ${
                                router.pathname === '/quotes' ? 'bg-white/10' : ''
                            }`}
                        >
                            <FileText className="w-4 h-4 mr-2.5" />
                            <span className="text-sm font-medium">Quotes</span>
                        </Link>

                        <Link
                            href="/customers"
                            className={`flex items-center px-4 py-2.5 text-primary-foreground hover:bg-white/10 rounded-md transition-all duration-200 hover-lift ${
                                router.pathname === '/customers' ? 'bg-white/10' : ''
                            }`}
                        >
                            <Building2 className="w-4 h-4 mr-2.5" />
                            <span className="text-sm font-medium">Customers</span>
                        </Link>

                        {user?.role === 'ADMIN' && (
                            <Link
                                href="/admin/user-management"
                                className={`flex items-center px-4 py-2.5 text-primary-foreground hover:bg-white/10 rounded-md transition-all duration-200 hover-lift ${
                                    router.pathname === '/admin/user-management' ? 'bg-white/10' : ''
                                }`}
                            >
                                <Users className="w-4 h-4 mr-2.5" />
                                <span className="text-sm font-medium">Users</span>
                            </Link>
                        )}
                    </nav>

                    {/* User Section */}
                    <div className="flex items-center gap-4">
                        <span className="text-white text-sm font-semibold">
                            {user?.firstName} {user?.lastName}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors duration-200"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            <span className="text-sm font-semibold">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navigation;
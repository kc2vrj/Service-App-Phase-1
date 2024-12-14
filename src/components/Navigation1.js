import React from 'react';
import Link from 'next/link';
import { Users, Clock, LogOut, Calendar, FileText, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-primary supports-[backdrop-filter]:bg-primary/80 backdrop-blur sticky top-0 z-50 shadow-soft-md">
      <div className="content-width">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center hover-lift">
            <img
              src="/maytech-logo.jpg"
              alt="Maytech Systems"
              className="h-12 w-auto"
            />
          </Link>

          {/* Right Section: Combining Navigation and User Section */}
          <div className="flex items-center gap-4">
            {/* Main Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/timesheet-daily"
                className="flex items-center px-4 py-2.5 text-primary-foreground hover:bg-white/10 rounded-md transition-all duration-200 hover-lift"
              >
                <Clock className="w-4 h-4 mr-2.5" />
                <span className="text-sm font-medium">Daily View</span>
              </Link>
              
              <Link
                href="/timesheet-weekly"
                className="flex items-center px-4 py-2.5 text-primary-foreground hover:bg-white/10 rounded-md transition-all duration-200 hover-lift"
              >
                <Calendar className="w-4 h-4 mr-2.5" />
                <span className="text-sm font-medium">Weekly View</span>
              </Link>

              <Link
                href="/quotes"
                className="flex items-center px-4 py-2.5 text-primary-foreground hover:bg-white/10 rounded-md transition-all duration-200 hover-lift"
              >
                <FileText className="w-4 h-4 mr-2.5" />
                <span className="text-sm font-medium">Quotes</span>
              </Link>

              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin/user-management"
                  className="flex items-center px-4 py-2 text-white hover:bg-[#0052D6] rounded-md transition-colors duration-200"
                >
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">User Management</span>
                </Link>
              )}
            </nav>

            {/* User Section */}
            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
              <span className="text-white text-sm font-semibold">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-white hover:bg-[#0052D6] rounded-md transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
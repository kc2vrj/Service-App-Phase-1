import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { Users, Clock, LogOut, Calendar } from 'lucide-react';

export default function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#1b1464] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="text-2xl font-bold">
                  <span className="text-[#ed1c24]">STRAT</span> Fire Security
                </a>
              </Link>
            </div>
            
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/timesheet-daily">
                <a className="flex items-center px-3 py-2 rounded-md text-white hover:bg-[#2d237a]">
                  <Clock className="w-4 h-4 mr-2" />
                  Daily View
                </a>
              </Link>

              <Link href="/timesheet-weekly">
                <a className="flex items-center px-3 py-2 rounded-md text-white hover:bg-[#2d237a]">
                  <Calendar className="w-4 h-4 mr-2" />
                  Weekly View
                </a>
              </Link>
              
              {user?.role === 'ADMIN' && (
                <Link href="/admin/user-management">
                  <a className="flex items-center px-3 py-2 rounded-md text-white hover:bg-[#2d237a]">
                    <Users className="w-4 h-4 mr-2" />
                    User Management
                  </a>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-white">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 rounded-md text-white hover:bg-[#2d237a]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
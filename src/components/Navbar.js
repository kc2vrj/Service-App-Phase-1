import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '../hooks/useTheme';
import { Menu, X, User, Clock, Users, FileText, Settings, LogOut, Calendar, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { hasAccess } from '@/lib/utils/role-utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { getColor, getSpacing, getShadow, theme } = useTheme();

  const navItems = [
    { href: '/timesheet-daily', label: 'Daily Timesheet', icon: Clock, minRole: 'USER' },
    { href: '/timesheet-weekly', label: 'Weekly View', icon: Calendar, minRole: 'USER' },
    { href: '/quotes', label: 'Quotes', icon: FileText, minRole: 'OFFICE' },
    { href: '/customers', label: 'Customers', icon: Building2, minRole: 'OFFICE' },
    { href: '/admin/user-management', label: 'Users', icon: Settings, minRole: 'ADMIN' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredNavItems = navItems.filter(item => 
    user?.role && hasAccess(user.role, item.minRole)
  );

  return (
    <nav
      style={{
        backgroundColor: getColor('background.paper'),
        boxShadow: getShadow('sm'),
        borderBottom: `1px solid ${getColor('border.main')}`,
        zIndex: theme.zIndex.nav
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src={theme.company.logo.main} 
              alt={theme.company.logo.alt}
              style={{
                height: theme.company.logo.height,
                width: 'auto'
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  router.pathname === item.href
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100'
                }`}
                style={{
                  color: router.pathname === item.href
                    ? getColor('text.white')
                    : getColor('text.primary'),
                  backgroundColor: router.pathname === item.href
                    ? getColor('primary.main')
                    : 'transparent'
                }}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            ))}
            
            {user && (
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="flex items-center space-x-1"
                style={{ color: getColor('text.primary') }}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant="ghost"
              className="p-2"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                  router.pathname === item.href
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100'
                }`}
                style={{
                  color: router.pathname === item.href
                    ? getColor('text.white')
                    : getColor('text.primary'),
                  backgroundColor: router.pathname === item.href
                    ? getColor('primary.main')
                    : 'transparent'
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span>{item.label}</span>
              </Link>
            ))}
            
            {user && (
              <Button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                variant="ghost"
                className="w-full flex items-center space-x-2 px-4 py-3 mt-4"
                style={{ color: getColor('text.primary') }}
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

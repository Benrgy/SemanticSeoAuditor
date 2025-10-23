import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Search, User, LogOut, BarChart3 } from 'lucide-react';
import { Button } from './ui/Button';

const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  return (
    <header className="bg-gray-800 border-b border-gray-700" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" aria-label="SEO Auditor Home">
              <BarChart3 className="h-8 w-8 text-blue-500" aria-hidden="true" />
              <span className="text-xl font-bold text-white">SEO Auditor</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {isLandingPage && (
              <>
                <button 
                  onClick={() => smoothScrollTo('features')}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button 
                  onClick={() => smoothScrollTo('benefits')}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Benefits
                </button>
                <button 
                  onClick={() => smoothScrollTo('how-it-works')}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => smoothScrollTo('faq')}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                  aria-label="Go to Dashboard"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center space-x-2" role="status" aria-label={`Logged in as ${user.email}`}>
                  <User className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  <span className="text-sm text-gray-300">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">Free SEO Analysis Tool</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
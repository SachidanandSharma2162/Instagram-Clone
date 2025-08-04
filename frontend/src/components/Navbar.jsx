import React, { useState } from 'react';
import {
  Home,
  Search,
  Compass,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  User,
  Circle,
  Menu,
  MessageSquareText,
  LogOut,
  LogIn,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';
import axios from 'axios';
import SearchOverlay from './SearchOverlay';

const Navbar = () => {
  const { user, isAuthenticated, setUser, url, loading } = useUser();
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return <div className="w-60 p-4">Loading...</div>;
  }

  const handleLogout = async () => {
    try {
      await axios.get(`${url}/users/logout`, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  const navItems = [
    isAuthenticated
      ? {
          label: 'Home',
          icon: <Home className="w-6 h-6" />,
          path: `/user/${user?.username}`,
        }
      : {
          label: 'Home',
          icon: <Home className="w-6 h-6" />,
          path: '/',
        },
    {
      label: 'Search',
      icon: <Search className="w-6 h-6" />,
      onClick: () => setShowSearch(true),
    },
    { label: 'Explore', icon: <Compass className="w-6 h-6" />, path: '/explore' },
    { label: 'Reels', icon: <Film className="w-6 h-6" />, path: '/reels' },
    ...(isAuthenticated
      ? [
          { label: 'Messages', icon: <MessageCircle className="w-6 h-6" />, path: '/messages', badge: 7 },
          { label: 'Notifications', icon: <Heart className="w-6 h-6" />, path: '/notifications' },
          { label: 'Create', icon: <PlusSquare className="w-6 h-6" />, path: '/create' },
          {
            label: user?.username || 'Profile',
            icon: <User className="w-6 h-6" />,
            path: '/profile',
          },
        ]
      : []),
  ];

  const bottomItems = [
    { label: 'Meta AI', icon: <Circle className="w-6 h-6" />, path: '/meta-ai' },
    { label: 'Threads', icon: <MessageSquareText className="w-6 h-6" />, path: '/threads' },
    isAuthenticated
      ? {
          label: 'Logout',
          icon: <LogOut className="w-6 h-6" />,
          action: handleLogout,
        }
      : {
          label: 'Login',
          icon: <LogIn className="w-6 h-6" />,
          path: '/',
        },
  ];

  return (
    <div className=" h-screen w-55 border-r p-4 flex flex-col justify-between relative">
      <div>
        <img className="w-[1/2] object-contain h-15 mb-6" src="/images/instaLogo.png" alt="Instagram" />
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="flex items-center gap-3 text-black hover:font-semibold transition"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center gap-3 text-black hover:font-semibold transition"
                >
                  <div className="relative">
                    {item.icon}
                    {item.badge && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <ul className="space-y-4">
        {bottomItems.map((item) =>
          item.action ? (
            <li key={item.label}>
              <button
                onClick={item.action}
                className="flex items-center gap-3 text-black hover:font-semibold transition"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ) : (
            <li key={item.label}>
              <Link
                to={item.path}
                className="flex items-center gap-3 text-black hover:font-semibold transition"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          )
        )}
      </ul>

      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
    </div>
  );
};

export default Navbar;

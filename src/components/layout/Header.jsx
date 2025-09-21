import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "Budget limit reached for Entertainment", type: "warning" },
    { id: 2, message: "Netflix payment due tomorrow", type: "info" },
    { id: 3, message: "You've saved $200 this week! 🎉", type: "success" },
  ]);

  return (
    <header className="bg-dark-900/30 backdrop-blur-xl border-b border-dark-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search transactions, categories..."
              className="w-full pl-10 pr-4 py-2 bg-dark-800/50 border border-dark-700 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-dark-300 hover:text-white transition-colors rounded-xl hover:bg-dark-800/50"
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </motion.button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-dark-800/50 transition-colors"
            >
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                alt={user?.name}
                className="h-8 w-8 rounded-full"
              />
              <div className="text-left">
                <div className="text-white text-sm font-medium">{user?.name}</div>
                <div className="text-dark-400 text-xs">{user?.email}</div>
              </div>
            </motion.button>

            {/* Dropdown */}
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-xl shadow-xl z-50"
              >
                <div className="py-2">
                  <button className="flex items-center w-full px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors">
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700 transition-colors">
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                  <hr className="my-2 border-dark-700" />
                  <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-error-400 hover:text-error-300 hover:bg-dark-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
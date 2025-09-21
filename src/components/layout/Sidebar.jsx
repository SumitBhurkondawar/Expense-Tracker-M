import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  PiggyBank, 
  Settings,
  DollarSign,
  Bell,
  Award
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Transactions', icon: CreditCard, href: '/dashboard/transactions' },
  { name: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
  { name: 'Accounts', icon: PiggyBank, href: '/dashboard/accounts' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-dark-900/50 backdrop-blur-xl border-r border-dark-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-800">
        <Link to="/dashboard" className="flex items-center">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-xl">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold text-white">MyMoney</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.name} to={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-dark-800">
        <div className="bg-dark-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-dark-400 text-sm">This Month</span>
            <Award className="h-4 w-4 text-accent-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-300">Saved</span>
              <span className="text-success-400 font-medium">₹450</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-300">Goal</span>
              <span className="text-dark-400">₹1000</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-success-500 to-success-400 h-2 rounded-full w-[45%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
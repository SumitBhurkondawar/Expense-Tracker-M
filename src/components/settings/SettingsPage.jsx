import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Download, 
  Trash2,
  Moon,
  Sun,
  Globe,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    billReminders: true,
    weeklyReports: false,
    achievements: true,
  });

  const [theme, setTheme] = useState('dark');
  const [currency, setCurrency] = useState('INR');

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const settingsSections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Profile Information', type: 'link' },
        { label: 'Change Password', type: 'link' },
        { label: 'Two-Factor Authentication', type: 'toggle', value: false },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { 
          label: 'Budget Alerts', 
          type: 'toggle', 
          value: notifications.budgetAlerts,
          key: 'budgetAlerts'
        },
        { 
          label: 'Bill Reminders', 
          type: 'toggle', 
          value: notifications.billReminders,
          key: 'billReminders'
        },
        { 
          label: 'Weekly Reports', 
          type: 'toggle', 
          value: notifications.weeklyReports,
          key: 'weeklyReports'
        },
        { 
          label: 'Achievement Notifications', 
          type: 'toggle', 
          value: notifications.achievements,
          key: 'achievements'
        },
      ]
    },
    {
      title: 'Preferences',
      icon: Palette,
      items: [
        { label: 'Theme', type: 'select', value: theme, options: ['Light', 'Dark', 'Auto'] },
        { label: 'Currency', type: 'select', value: currency, options: ['INR', 'USD', 'EUR', 'GBP', 'JPY'] },
        { label: 'Language', type: 'select', value: 'English', options: ['English', 'Spanish', 'French'] },
      ]
    },
    {
      title: 'Data & Privacy',
      icon: Shield,
      items: [
        { label: 'Export Data', type: 'button', icon: Download },
        { label: 'Delete Account', type: 'button', icon: Trash2, danger: true },
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-dark-400 mt-1">Manage your account preferences and settings</p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-6"
      >
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="h-16 w-16 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-dark-400">{user?.email}</p>
            <p className="text-primary-400 text-sm mt-1">Premium Member</p>
          </div>
        </div>
      </motion.div>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 + sectionIndex * 0.1 }}
          className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-6"
        >
          <div className="flex items-center mb-4">
            <section.icon className="h-5 w-5 text-primary-400 mr-2" />
            <h2 className="text-xl font-bold text-white">{section.title}</h2>
          </div>

          <div className="space-y-4">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  {item.icon && <item.icon className="h-4 w-4 text-dark-400 mr-3" />}
                  <span className={`${item.danger ? 'text-error-400' : 'text-white'}`}>
                    {item.label}
                  </span>
                </div>

                {item.type === 'toggle' && (
                  <button
                    onClick={() => item.key && toggleNotification(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      item.value ? 'bg-primary-600' : 'bg-dark-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        item.value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                )}

                {item.type === 'select' && (
                  <select 
                    value={item.value}
                    className="bg-dark-900/50 border border-dark-600 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-primary-500"
                  >
                    {item.options?.map(option => (
                      <option key={option} value={option.toLowerCase()}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {item.type === 'button' && (
                  <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.danger 
                      ? 'bg-error-600/20 text-error-400 hover:bg-error-600/30' 
                      : 'bg-primary-600/20 text-primary-400 hover:bg-primary-600/30'
                  }`}>
                    {item.label}
                  </button>
                )}

                {item.type === 'link' && (
                  <button className="text-primary-400 hover:text-primary-300 text-sm">
                    Configure
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-center"
      >
        <button
          onClick={logout}
          className="bg-error-600/20 text-error-400 hover:bg-error-600/30 hover:text-error-300 font-medium py-3 px-6 rounded-xl transition-colors"
        >
          Sign Out
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
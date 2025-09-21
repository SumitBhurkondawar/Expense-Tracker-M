import React from 'react';
import { motion } from 'framer-motion';
import StatsCards from './StatsCards';
import TransactionChart from './TransactionChart';
import RecentTransactions from './RecentTransactions';
import CategoryBreakdown from './CategoryBreakdown';
import QuickActions from './QuickActions';
import AchievementsBanner from './AchievementsBanner';
import AIInsights from './AIInsights';

const DashboardHome = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-dark-400 mt-1">Welcome back! Here's your financial overview.</p>
        </div>
        <QuickActions />
      </div>

      <AchievementsBanner />
      
      <StatsCards />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionChart />
        </div>
        <div>
          <CategoryBreakdown />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentTransactions />
        <AIInsights />
      </div>
    </motion.div>
  );
};

export default DashboardHome;
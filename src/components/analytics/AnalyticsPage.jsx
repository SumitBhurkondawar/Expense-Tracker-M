import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import TransactionChart from '../dashboard/TransactionChart';
import CategoryBreakdown from '../dashboard/CategoryBreakdown';

const AnalyticsPage = () => {
  const [period, setPeriod] = useState('month');
  const { getTotalIncome, getTotalExpenses, transactions } = useData();

  const totalIncome = getTotalIncome(period);
  const totalExpenses = getTotalExpenses(period);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;

  const stats = [
    {
      title: 'Total Income',
      value: totalIncome,
      icon: TrendingUp,
      color: 'success',
      change: '+12.5%'
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: BarChart3,
      color: 'error',
      change: '-3.2%'
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      icon: PieChart,
      color: savingsRate > 20 ? 'success' : savingsRate > 10 ? 'warning' : 'error',
      change: '+2.1%'
    },
    {
      title: 'Transactions',
      value: transactions.length,
      icon: Calendar,
      color: 'primary',
      change: '+8'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-dark-400 mt-1">Detailed insights into your financial patterns</p>
        </div>
        
        <div className="flex bg-dark-800/50 rounded-xl p-1">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm rounded-lg transition-all capitalize ${
                period === p
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-500/20`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
              </div>
              <span className={`text-sm font-medium text-${stat.color}-400`}>
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-dark-400 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-white">
                {typeof stat.value === 'number' && stat.title !== 'Transactions' 
                  ? `₹${stat.value.toLocaleString('en-IN')}` 
                  : stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionChart />
        </div>
        <div>
          <CategoryBreakdown />
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Spending Trends</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-dark-300">Average Daily Spending</span>
              <span className="text-white font-medium">₹{(totalExpenses / 30).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dark-300">Highest Expense Day</span>
              <span className="text-white font-medium">Monday</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dark-300">Most Active Category</span>
              <span className="text-white font-medium">Food & Dining</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Financial Health</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-dark-300">Savings Goal Progress</span>
                <span className="text-white font-medium">68%</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-success-500 to-success-400 h-3 rounded-full w-[68%]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-dark-300">Budget Utilization</span>
                <span className="text-white font-medium">82%</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-warning-500 to-warning-400 h-3 rounded-full w-[82%]"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;
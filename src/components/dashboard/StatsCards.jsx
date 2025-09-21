import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const StatsCards = () => {
  const { getTotalBalance, getTotalIncome, getTotalExpenses } = useData();

  const totalBalance = getTotalBalance();
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const netIncome = totalIncome - totalExpenses;

  const stats = [
    {
      title: 'Total Balance',
      amount: totalBalance,
      icon: Wallet,
      color: 'primary',
      change: '+2.5%',
      changeType: 'positive'
    },
    {
      title: 'Monthly Income',
      amount: totalIncome,
      icon: TrendingUp,
      color: 'success',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Monthly Expenses',
      amount: totalExpenses,
      icon: TrendingDown,
      color: 'error',
      change: '-5.2%',
      changeType: 'negative'
    },
    {
      title: 'Net Income',
      amount: netIncome,
      icon: Target,
      color: netIncome >= 0 ? 'success' : 'error',
      change: '+8.1%',
      changeType: netIncome >= 0 ? 'positive' : 'negative'
    }
  ];

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getColorClasses = (color) => {
    const colors = {
      primary: 'from-primary-500 to-primary-600',
      success: 'from-success-500 to-success-600',
      error: 'from-error-500 to-error-600',
      warning: 'from-warning-500 to-warning-600',
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-6 hover:border-dark-600 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${getColorClasses(stat.color)}/20`}>
              <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
            </div>
            <div className={`text-sm font-medium ${
              stat.changeType === 'positive' ? 'text-success-400' : 'text-error-400'
            }`}>
              {stat.change}
            </div>
          </div>
          
          <div>
            <h3 className="text-dark-400 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">
              {formatAmount(stat.amount)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
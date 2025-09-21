import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MoreHorizontal, Trash2, Edit3 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const RecentTransactions = () => {
  const { getRecentTransactions, categories, deleteTransaction } = useData();
  const [hoveredId, setHoveredId] = useState(null);
  
  const recentTransactions = getRecentTransactions(8);

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || '💳';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#64748b';
  };

  const handleDelete = (transactionId) => {
    deleteTransaction(transactionId);
    toast.success('Transaction deleted successfully');
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Math.abs(amount));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-primary-400 mr-2" />
          <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
        </div>
        <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {recentTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group flex items-center justify-between p-4 bg-dark-900/30 hover:bg-dark-900/50 rounded-xl transition-all duration-200 cursor-pointer"
            onMouseEnter={() => setHoveredId(transaction.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ 
                  backgroundColor: `${getCategoryColor(transaction.category)}20`,
                  border: `1px solid ${getCategoryColor(transaction.category)}30`
                }}
              >
                {getCategoryIcon(transaction.category)}
              </div>
              
              <div>
                <h3 className="font-medium text-white">{transaction.title}</h3>
                <p className="text-dark-400 text-sm">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.amount > 0 ? 'text-success-400' : 'text-error-400'
                }`}>
                  {transaction.amount > 0 ? '+' : '-'}{formatAmount(transaction.amount)}
                </p>
                <p className="text-dark-400 text-sm">
                  {transaction.type === 'income' ? 'Income' : 'Expense'}
                </p>
              </div>

              {hoveredId === transaction.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-1"
                >
                  <button className="p-1 text-dark-400 hover:text-primary-400 transition-colors">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(transaction.id)}
                    className="p-1 text-dark-400 hover:text-error-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {recentTransactions.length === 0 && (
        <div className="text-center py-8">
          <div className="text-dark-400 mb-2">No transactions yet</div>
          <p className="text-dark-500 text-sm">Start by adding your first transaction</p>
        </div>
      )}
    </motion.div>
  );
};

export default RecentTransactions;
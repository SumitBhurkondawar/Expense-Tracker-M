import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Search, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const TransactionsPage = () => {
  const { transactions, categories, accounts } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const exportToExcel = () => {
    const exportData = filteredTransactions.map(transaction => {
      const category = categories.find(c => c.id === transaction.category);
      const account = accounts.find(a => a.id === transaction.accountId);
      
      return {
        Date: new Date(transaction.date).toLocaleDateString(),
        Title: transaction.title,
        Amount: transaction.amount,
        Type: transaction.type,
        Category: category?.name || 'Unknown',
        Account: account?.name || 'Unknown',
        Description: transaction.description || '',
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success('Transactions exported successfully!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <p className="text-dark-400 mt-1">Manage and track all your financial transactions</p>
        </div>
        
        <button
          onClick={exportToExcel}
          className="bg-success-600 hover:bg-success-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center space-x-2 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-dark-900/50 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-dark-900/50 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <select className="px-4 py-2 bg-dark-900/50 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-900/50 border-b border-dark-700">
              <tr>
                <th className="text-left py-4 px-6 text-dark-300 font-medium">Transaction</th>
                <th className="text-left py-4 px-6 text-dark-300 font-medium">Category</th>
                <th className="text-left py-4 px-6 text-dark-300 font-medium">Account</th>
                <th className="text-left py-4 px-6 text-dark-300 font-medium">Date</th>
                <th className="text-right py-4 px-6 text-dark-300 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => {
                const category = categories.find(c => c.id === transaction.category);
                const account = accounts.find(a => a.id === transaction.accountId);
                
                return (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-dark-800 hover:bg-dark-900/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="text-white font-medium">{transaction.title}</div>
                        {transaction.description && (
                          <div className="text-dark-400 text-sm">{transaction.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{category?.icon}</span>
                        <span className="text-dark-300">{category?.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-dark-300">{account?.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-dark-300">
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`font-semibold ${
                        transaction.amount > 0 ? 'text-success-400' : 'text-error-400'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}
                        ₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-dark-400 mb-2">No transactions found</div>
            <p className="text-dark-500 text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionsPage;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

const QuickActions = () => {
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    accountId: '',
    description: ''
  });

  const { categories, accounts, addTransaction } = useData();

  const filteredCategories = categories.filter(c => c.type === transactionType);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.category || !formData.accountId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const transaction = {
      ...formData,
      amount: transactionType === 'expense' ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount)),
      type: transactionType
    };

    addTransaction(transaction);
    toast.success(`${transactionType === 'income' ? 'Income' : 'Expense'} added successfully!`);
    
    setFormData({
      title: '',
      amount: '',
      category: '',
      accountId: '',
      description: ''
    });
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-2 px-4 rounded-xl flex items-center space-x-2 transition-all duration-200"
      >
        <Plus className="h-5 w-5" />
        <span>Add Transaction</span>
      </motion.button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-dark-800 border border-dark-700 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add Transaction</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-dark-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Transaction Type Selector */}
            <div className="flex bg-dark-900/50 rounded-xl p-1 mb-6">
              <button
                onClick={() => setTransactionType('expense')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg transition-all ${
                  transactionType === 'expense'
                    ? 'bg-error-600 text-white'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                <ArrowDownLeft className="h-4 w-4 mr-2" />
                Expense
              </button>
              <button
                onClick={() => setTransactionType('income')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg transition-all ${
                  transactionType === 'income'
                    ? 'bg-success-600 text-white'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Income
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                  placeholder="Enter transaction title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
                  required
                >
                  <option value="">Select category</option>
                  {filteredCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Account *
                </label>
                <select
                  name="accountId"
                  value={formData.accountId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
                  required
                >
                  <option value="">Select account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 resize-none"
                  rows="3"
                  placeholder="Optional description"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 border border-dark-600 text-dark-300 hover:text-white hover:border-dark-500 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default QuickActions;
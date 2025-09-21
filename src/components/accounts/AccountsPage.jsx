import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CreditCard, PiggyBank, TrendingUp, Edit3, Trash2, X, Target, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';

const AccountsPage = () => {
  const { accounts, addAccount, updateAccount, deleteAccount, getTotalBalance, addGoal } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    balance: '',
    color: '#3b82f6'
  });
  const [goalData, setGoalData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    description: ''
  });

  const totalBalance = getTotalBalance();

  const getAccountIcon = (type) => {
    switch (type) {
      case 'checking':
        return CreditCard;
      case 'savings':
        return PiggyBank;
      case 'investment':
        return TrendingUp;
      default:
        return CreditCard;
    }
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.balance) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isNaN(parseFloat(formData.balance)) || parseFloat(formData.balance) < 0) {
      toast.error('Please enter a valid balance amount');
      return;
    }
    const newAccount = {
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
      color: formData.color
    };

    addAccount(newAccount)
      .then(() => {
        toast.success('Account added successfully!');
        setFormData({
          name: '',
          type: 'checking',
          balance: '',
          color: '#3b82f6'
        });
        setShowAddModal(false);
      })
      .catch((error) => {
        console.error('Error adding account:', error);
        toast.error('Failed to add account. Please try again.');
      });
  };

  const handleEditAccount = (e) => {
    e.preventDefault();
    
    if (!formData.name || formData.balance === '') {
      toast.error('Please fill in all required fields');
      return;
    }

    updateAccount(selectedAccount.id, {
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
      color: formData.color
    });
    
    toast.success('Account updated successfully!');
    setShowEditModal(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = (accountId) => {
    if (accounts.length <= 1) {
      toast.error('You must have at least one account');
      return;
    }

    deleteAccount(accountId);
    toast.success('Account deleted successfully!');
  };

  const openEditModal = (account) => {
    setSelectedAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      color: account.color
    });
    setShowEditModal(true);
  };

  const handleSetGoal = (e) => {
    e.preventDefault();
    
    if (!goalData.title || !goalData.targetAmount) {
      toast.error('Please fill in required fields');
      return;
    }

    const newGoal = {
      title: goalData.title,
      targetAmount: parseFloat(goalData.targetAmount),
      currentAmount: parseFloat(goalData.currentAmount) || 0,
      deadline: goalData.deadline,
      description: goalData.description,
      progress: goalData.currentAmount ? (parseFloat(goalData.currentAmount) / parseFloat(goalData.targetAmount)) * 100 : 0
    };

    addGoal(newGoal);
    toast.success('Financial goal set successfully!');
    
    setGoalData({
      title: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      description: ''
    });
    setShowGoalModal(false);
  };

  const handleInputChange = (e, isGoal = false) => {
    const { name, value } = e.target;
    if (isGoal) {
      setGoalData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Accounts</h1>
          <p className="text-dark-400 mt-1">Manage your financial accounts and balances</p>
        </div>
        
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGoalModal(true)}
            className="bg-secondary-600 hover:bg-secondary-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center space-x-2 transition-colors"
          >
            <Target className="h-5 w-5" />
            <span>Set Goal</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-xl flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Account</span>
          </motion.button>
        </div>
      </div>

      {/* Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 border border-primary-500/30 rounded-2xl p-6"
      >
        <div className="text-center">
          <h2 className="text-dark-300 text-lg mb-2">Total Balance</h2>
          <p className="text-4xl font-bold text-white">
            {formatCurrency(totalBalance)}
          </p>
          <p className="text-primary-400 text-sm mt-2">Across all accounts</p>
        </div>
      </motion.div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account, index) => {
          const IconComponent = getAccountIcon(account.type);
          
          return (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-6 hover:border-dark-600 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${account.color}20` }}
                >
                  <IconComponent 
                    className="h-6 w-6" 
                    style={{ color: account.color }}
                  />
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(account)}
                    className="text-dark-400 hover:text-primary-400 transition-colors p-1"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteAccount(account.id)}
                    className="text-dark-400 hover:text-error-400 transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">
                  {account.name}
                </h3>
                <p className="text-dark-400 text-sm capitalize mb-3">
                  {account.type} Account
                </p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(account.balance)}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-700">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">This month</span>
                  <span className="text-success-400">+2.5%</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-dark-900/50 hover:bg-dark-900/70 border border-dark-600 rounded-xl p-4 text-left transition-colors">
            <div className="text-primary-400 font-medium mb-1">Transfer Money</div>
            <div className="text-dark-400 text-sm">Move funds between accounts</div>
          </button>
          <button className="bg-dark-900/50 hover:bg-dark-900/70 border border-dark-600 rounded-xl p-4 text-left transition-colors">
            <div className="text-secondary-400 font-medium mb-1">Pay Bills</div>
            <div className="text-dark-400 text-sm">Schedule or pay pending bills</div>
          </button>
          <button 
            onClick={() => setShowGoalModal(true)}
            className="bg-dark-900/50 hover:bg-dark-900/70 border border-dark-600 rounded-xl p-4 text-left transition-colors"
          >
            <div className="text-accent-400 font-medium mb-1">Set Goals</div>
            <div className="text-dark-400 text-sm">Create financial targets</div>
          </button>
        </div>
      </motion.div>

      {/* Add Account Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-dark-800 border border-dark-700 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Add New Account</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                    placeholder="Enter account name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Account Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
                    required
                  >
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                    <option value="investment">Investment Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Initial Balance (₹) *
                  </label>
                  <input
                    type="number"
                    name="balance"
                    value={formData.balance}
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
                    Account Color
                  </label>
                  <div className="flex space-x-3">
                    {['#3b82f6', '#22c55e', '#8b5cf6', '#f97316', '#ef4444', '#06b6d4'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? 'border-white' : 'border-dark-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 px-4 border border-dark-600 text-dark-300 hover:text-white hover:border-dark-500 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors"
                  >
                    Add Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Account Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-dark-800 border border-dark-700 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Edit Account</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEditAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                    placeholder="Enter account name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Account Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
                    required
                  >
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                    <option value="investment">Investment Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Current Balance (₹) *
                  </label>
                  <input
                    type="number"
                    name="balance"
                    value={formData.balance}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Account Color
                  </label>
                  <div className="flex space-x-3">
                    {['#3b82f6', '#22c55e', '#8b5cf6', '#f97316', '#ef4444', '#06b6d4'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? 'border-white' : 'border-dark-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3 px-4 border border-dark-600 text-dark-300 hover:text-white hover:border-dark-500 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors"
                  >
                    Update Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Set Goal Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-dark-800 border border-dark-700 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Set Financial Goal</h2>
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSetGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={goalData.title}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                    placeholder="e.g., Emergency Fund, Vacation, New Car"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Target Amount (₹) *
                  </label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={goalData.targetAmount}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Current Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="currentAmount"
                    value={goalData.currentAmount}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={goalData.deadline}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={goalData.description}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 resize-none"
                    rows="3"
                    placeholder="Optional description for your goal"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGoalModal(false)}
                    className="flex-1 py-3 px-4 border border-dark-600 text-dark-300 hover:text-white hover:border-dark-500 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-secondary-600 hover:bg-secondary-700 text-white rounded-xl transition-colors"
                  >
                    Set Goal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AccountsPage;
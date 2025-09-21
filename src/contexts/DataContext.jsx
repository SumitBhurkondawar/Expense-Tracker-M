import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { dbHelpers } from '../lib/supabase';

const DataContext = createContext({});

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [goals, setGoals] = useState([]);

  // Initialize default data
  useEffect(() => {
    if (user) {
      initializeData();
    }
  }, [user]);

  const initializeData = async () => {
    try {
      console.log('🔄 Initializing data for user:', user?.id, user?.email);
      // Try to load from database first
      if (user?.id && !user.id.startsWith('demo-user-')) {
        await loadUserData();
      } else {
        // Load demo data
        initializeDefaultData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to default data
      initializeDefaultData();
    }
  };

  const loadUserData = async () => {
    try {
      console.log('🔄 Loading user data for user:', user.id, 'Email:', user.email);
      
      // First ensure user exists in database
      let existingUser = await dbHelpers.getUser(user.id);
      if (!existingUser) {
        console.log('👤 User not found in database, creating user record...');
        await dbHelpers.createUser({
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        });
        console.log('✅ User record created successfully');
      }
      
      const userAccounts = await dbHelpers.getAccounts(user.id);
      console.log('📊 Loaded accounts for user:', userAccounts.length, 'accounts');
      
      if (userAccounts.length > 0) {
        setAccounts(userAccounts);
      } else {
        console.log('🏦 No accounts found, creating default accounts for user:', user.id);
        await createDefaultAccounts();
      }

      const userTransactions = await dbHelpers.getTransactions(user.id);
      console.log('💳 Loaded transactions for user:', userTransactions.length, 'transactions');
      setTransactions(userTransactions);

      const userGoals = await dbHelpers.getGoals(user.id);
      console.log('🎯 Loaded goals for user:', userGoals.length, 'goals');
      setGoals(userGoals);

      initializeCategories();
    } catch (error) {
      console.error('Database error:', error);
      console.log('⚠️ Database error for user:', user.id, '- Using demo data');
      initializeDefaultData();
    }
  };

  const createDefaultAccounts = async () => {
    console.log('🏦 Creating default accounts for user:', user.id);
    const defaultAccounts = [
      { name: `${user.name}'s Main Account`, balance: 25000, type: 'checking', color: '#3b82f6', user_id: user.id },
      { name: `${user.name}'s Savings`, balance: 87500, type: 'savings', color: '#22c55e', user_id: user.id },
      { name: `${user.name}'s Investment`, balance: 154200, type: 'investment', color: '#8b5cf6', user_id: user.id },
    ];

    const createdAccounts = [];
    for (const account of defaultAccounts) {
      try {
        console.log('🏦 Creating account for user:', user.id, '- Account:', account.name);
        const created = await dbHelpers.createAccount(account);
        console.log('✅ Account created successfully:', created.name);
        createdAccounts.push(created);
      } catch (error) {
        console.error('❌ Error creating account for user:', user.id, error);
      }
    }
    
    if (createdAccounts.length > 0) {
      setAccounts(createdAccounts);
      console.log('🎉 Created', createdAccounts.length, 'default accounts for user:', user.id);
    }
  };

  const initializeCategories = () => {
    const defaultCategories = [
      { id: '1', name: 'Food & Dining', icon: '🍽️', color: '#f97316', type: 'expense' },
      { id: '2', name: 'Transportation', icon: '🚗', color: '#3b82f6', type: 'expense' },
      { id: '3', name: 'Shopping', icon: '🛍️', color: '#ec4899', type: 'expense' },
      { id: '4', name: 'Entertainment', icon: '🎬', color: '#8b5cf6', type: 'expense' },
      { id: '5', name: 'Bills & Utilities', icon: '💡', color: '#ef4444', type: 'expense' },
      { id: '6', name: 'Healthcare', icon: '🏥', color: '#10b981', type: 'expense' },
      { id: '7', name: 'Salary', icon: '💼', color: '#22c55e', type: 'income' },
      { id: '8', name: 'Investment', icon: '📈', color: '#06b6d4', type: 'income' },
      { id: '9', name: 'Freelance', icon: '💻', color: '#f59e0b', type: 'income' },
    ];

    setCategories(defaultCategories);
  };

  const initializeDefaultData = () => {
    const defaultAccounts = [
      { id: crypto.randomUUID(), name: 'Main Account', balance: 25000, type: 'checking', color: '#3b82f6' },
      { id: crypto.randomUUID(), name: 'Savings', balance: 87500, type: 'savings', color: '#22c55e' },
      { id: crypto.randomUUID(), name: 'Investment', balance: 154200, type: 'investment', color: '#8b5cf6' },
    ];

    const sampleTransactions = [
      {
        id: crypto.randomUUID(),
        title: 'Grocery Shopping',
        amount: -1200,
        category: '1',
        accountId: defaultAccounts[0].id,
        date: new Date().toISOString(),
        type: 'expense',
        description: 'Weekly groceries'
      },
      {
        id: crypto.randomUUID(),
        title: 'Salary Deposit',
        amount: 45000,
        category: '7',
        accountId: defaultAccounts[0].id,
        date: new Date(Date.now() - 86400000).toISOString(),
        type: 'income',
        description: 'Monthly salary'
      },
      {
        id: crypto.randomUUID(),
        title: 'Uber Ride',
        amount: -250,
        category: '2',
        accountId: defaultAccounts[0].id,
        date: new Date(Date.now() - 172800000).toISOString(),
        type: 'expense',
        description: 'Trip to office'
      },
    ];

    const sampleGoals = [
      {
        id: crypto.randomUUID(),
        title: 'Emergency Fund',
        targetAmount: 100000,
        currentAmount: 25000,
        deadline: '2025-12-31',
        description: 'Build emergency fund for 6 months expenses',
        progress: 25
      },
      {
        id: crypto.randomUUID(),
        title: 'Vacation Fund',
        targetAmount: 50000,
        currentAmount: 12000,
        deadline: '2025-08-15',
        description: 'Save for summer vacation',
        progress: 24
      }
    ];

    const sampleAchievements = [
      {
        id: crypto.randomUUID(),
        title: 'First Step',
        description: 'Added your first transaction',
        icon: '🎯',
        unlocked: true,
        date: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'Saver',
        description: 'Saved ₹10,000 this month',
        icon: '💰',
        unlocked: false,
        target: 10000,
        current: 4500
      },
    ];

    setAccounts(defaultAccounts);
    setTransactions(sampleTransactions);
    setGoals(sampleGoals);
    setAchievements(sampleAchievements);
    initializeCategories();
  };

  const addTransaction = async (transaction) => {
    try {
      console.log('Adding transaction:', transaction);
      console.log('Current user:', user?.id);
      
      const transactionData = {
        ...transaction,
        user_id: user.id,
        account_id: transaction.accountId,
        date: new Date().toISOString(),
      };

      let newTransaction;
      if (user?.id && !user.id.startsWith('demo-user-')) {
        console.log('Saving transaction to database:', transactionData);
        newTransaction = await dbHelpers.createTransaction(transactionData);
        console.log('Transaction saved:', newTransaction);
      } else {
        newTransaction = {
          ...transactionData,
          id: crypto.randomUUID(),
        };
        console.log('Demo transaction created:', newTransaction);
      }
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Update account balance
      await updateAccountBalance(transaction.accountId, parseFloat(transaction.amount));

      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      // Fallback to local transaction creation
      const localTransaction = {
        ...transaction,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        user_id: user.id,
        account_id: transaction.accountId,
      };
      
      setTransactions(prev => [localTransaction, ...prev]);
      
      await updateAccountBalance(transaction.accountId, parseFloat(transaction.amount));

      return localTransaction;
    }
  };

  const updateAccountBalance = async (accountId, amount) => {
    try {
      console.log('🔄 Updating account balance:', accountId, 'Amount:', amount);
      
      // Update local state
      setAccounts(prev => prev.map(account => {
        if (account.id === accountId) {
          const newBalance = parseFloat(account.balance) + amount;
          console.log('💰 Account balance updated:', account.name, 'Old:', account.balance, 'New:', newBalance);
          
          // Update database if not demo user
          if (user?.id && !user.id.startsWith('demo-user-')) {
            updateAccount(accountId, { balance: newBalance }).catch(error => {
              console.error('❌ Error updating account balance in database:', error);
            });
          }
          
          return { ...account, balance: newBalance };
        }
        return account;
      }));
    } catch (error) {
      console.error('❌ Error updating account balance:', error);
    }
  };

  const addTransactionLocal = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    updateAccountBalance(transaction.accountId, parseFloat(transaction.amount));

    return newTransaction;
  };

  const deleteTransaction = async (id) => {
    try {
      const transaction = transactions.find(t => t.id === id);
      if (!transaction) return;
      
      if (user?.id && !user.id.startsWith('demo-user-')) {
        await dbHelpers.deleteTransaction(id);
      }
      
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Reverse the transaction amount when deleting
      await updateAccountBalance(transaction.accountId || transaction.account_id, -parseFloat(transaction.amount));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const addAccount = async (accountData) => {
    try {
      console.log('Adding account:', accountData);
      console.log('Current user:', user?.id);
      
      let newAccount;
      if (user?.id && !user.id.startsWith('demo-user-')) {
        const newAccountData = {
          ...accountData,
          user_id: user.id,
          balance: parseFloat(accountData.balance)
        };
        console.log('Saving account to database:', newAccountData);
        newAccount = await dbHelpers.createAccount(newAccountData);
        console.log('Account saved:', newAccount);
      } else {
        newAccount = {
          ...accountData,
          id: crypto.randomUUID(),
          balance: parseFloat(accountData.balance)
        };
        console.log('Demo account created:', newAccount);
      }
      
      setAccounts(prev => [...prev, newAccount]);
      return newAccount;
    } catch (error) {
      console.error('Error adding account:', error);
      // Fallback to local account creation
      const localAccount = {
        ...accountData,
        id: crypto.randomUUID(),
        balance: parseFloat(accountData.balance)
      };
      setAccounts(prev => [...prev, localAccount]);
      console.log('Account created locally:', localAccount);
      return localAccount;
    }
  };

  const addAccountLocal = (accountData) => {
    const newAccount = {
      ...accountData,
      id: crypto.randomUUID(),
      balance: parseFloat(accountData.balance)
    };
    
    setAccounts(prev => [...prev, newAccount]);
    return newAccount;
  };

  const updateAccount = async (accountId, updatedData) => {
    try {
      console.log('🔄 Updating account:', accountId, 'Data:', updatedData);
      
      if (user?.id && !user.id.startsWith('demo-user-')) {
        await dbHelpers.updateAccount(accountId, {
          ...updatedData,
          balance: updatedData.balance ? parseFloat(updatedData.balance) : undefined
        });
        console.log('✅ Account updated in database');
      }
      
      setAccounts(prev => prev.map(account => 
        account.id === accountId 
          ? { 
              ...account, 
              ...updatedData, 
              balance: updatedData.balance ? parseFloat(updatedData.balance) : account.balance 
            }
          : account
      ));
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const deleteAccount = async (accountId) => {
    try {
      if (user?.id && !user.id.startsWith('demo-user-')) {
        await dbHelpers.deleteAccount(accountId);
      }
      setAccounts(prev => prev.filter(account => account.id !== accountId));
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const addGoal = async (goalData) => {
    try {
      console.log('Adding goal:', goalData);
      console.log('Current user:', user?.id);
      
      let newGoal;
      if (user?.id && !user.id.startsWith('demo-user-')) {
        const newGoalData = {
          ...goalData,
          user_id: user.id,
          target_amount: parseFloat(goalData.targetAmount),
          current_amount: parseFloat(goalData.currentAmount) || 0,
          progress: goalData.currentAmount ? (parseFloat(goalData.currentAmount) / parseFloat(goalData.targetAmount)) * 100 : 0
        };
        console.log('Saving goal to database:', newGoalData);
        newGoal = await dbHelpers.createGoal(newGoalData);
        console.log('Goal saved:', newGoal);
      } else {
        newGoal = {
          ...goalData,
          id: crypto.randomUUID(),
          targetAmount: parseFloat(goalData.targetAmount),
          currentAmount: parseFloat(goalData.currentAmount) || 0,
          progress: goalData.currentAmount ? (parseFloat(goalData.currentAmount) / parseFloat(goalData.targetAmount)) * 100 : 0
        };
      }
      
      setGoals(prev => [...prev, newGoal]);
      toast.success('Goal created successfully!');
      return newGoal;
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error('Failed to save goal to database');
      return addGoalLocal(goalData);
    }
  };

  const addGoalLocal = (goalData) => {
    const newGoal = {
      ...goalData,
      id: crypto.randomUUID(),
      targetAmount: parseFloat(goalData.targetAmount),
      currentAmount: parseFloat(goalData.currentAmount) || 0,
      progress: goalData.currentAmount ? (parseFloat(goalData.currentAmount) / parseFloat(goalData.targetAmount)) * 100 : 0
    };
    
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + parseFloat(account.balance || 0), 0);
  };

  const getTotalIncome = (period = 'month') => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions
      .filter(t => t.type === 'income' && new Date(t.date) >= startOfMonth)
      .reduce((total, t) => total + parseFloat(t.amount || 0), 0);
  };

  const getTotalExpenses = (period = 'month') => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return Math.abs(transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
      .reduce((total, t) => total + parseFloat(t.amount || 0), 0));
  };

  const getRecentTransactions = (limit = 10) => {
    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  const getCategoryData = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const categoryTotals = {};
    
    transactions
      .filter(t => t.type === 'expense' && new Date(t.date) >= startOfMonth)
      .forEach(transaction => {
        const category = categories.find(c => c.id === transaction.category);
        if (category) {
          categoryTotals[category.name] = (categoryTotals[category.name] || 0) + Math.abs(parseFloat(transaction.amount || 0));
        }
      });
    
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: categories.find(c => c.name === name)?.color || '#64748b'
    }));
  };

  const getChartData = (period = '7d') => {
    const now = new Date();
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 365;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= dayStart && tDate < dayEnd;
      });
      
      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
      const expenses = Math.abs(dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0));
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        income,
        expenses,
        net: income - expenses
      });
    }
    
    return data;
  };

  const value = {
    transactions,
    accounts,
    categories,
    achievements,
    goals,
    addAccount,
    addGoal,
    addTransaction,
    deleteTransaction,
    updateAccount,
    deleteAccount,
    getTotalBalance,
    getTotalIncome,
    getTotalExpenses,
    getRecentTransactions,
    getCategoryData,
    getChartData,
    setCategories,
    setAccounts,
    setGoals,
    setAchievements,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
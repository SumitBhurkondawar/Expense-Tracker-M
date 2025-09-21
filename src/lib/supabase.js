import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Configuration:');
console.log('📍 URL:', supabaseUrl);
console.log('🔑 Key configured:', supabaseAnonKey ? 'Yes' : 'No');

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const configured = supabaseUrl && 
                    supabaseAnonKey && 
                    supabaseUrl !== 'https://placeholder.supabase.co' &&
                    supabaseAnonKey !== 'placeholder-key';
  
  console.log('✅ Supabase configured:', configured);
  return configured;
};

// Create Supabase client only if properly configured
export const supabase = isSupabaseConfigured() ? (() => {
  console.log('🚀 Creating Supabase client...');
  const client = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase client created successfully');
  return client;
})() : null;

// Database helper functions with proper error handling
export const dbHelpers = {
  // Users
  async createUser(userData) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured. Please connect to Supabase first.');
    }
    
    try {
      console.log('Creating user with ID:', userData.id);
      
      // Check if user already exists first
      const existingUser = await this.getUser(userData.id);
      if (existingUser) {
        console.log('User already exists:', existingUser);
        return existingUser;
      }
      
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }
      console.log('User created successfully:', data);
      return data;
    } catch (error) {
      console.error('Database error in createUser:', error);
      throw error;
    }
  },

  getUser: async (userId) => {
    try {
      console.log('🔄 Getting user from database:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Database error in getUser:', error.message);
        throw error;
      }
      
      console.log('✅ User retrieved:', data);
      return data;
    } catch (error) {
      console.error('Database error in getUser:', error.message);
      return null;
    }
  },

  async getUser(userId) {
    if (!isSupabaseConfigured() || !supabase) {
      console.log('⚠️ Supabase not configured, cannot get user');
      return null;
    }
    
    try {
      console.log('Getting user with ID:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error getting user:', error);
        return null;
      }
      console.log('User data retrieved:', data);
      return data;
    } catch (error) {
      console.error('Database error in getUser:', error);
      return null;
    }
  },

  // Accounts
  async getAccounts(userId) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      console.log('Getting accounts for user ID:', userId);
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error getting accounts:', error);
        throw error;
      }
      console.log('Accounts retrieved for user:', data);
      return data || [];
    } catch (error) {
      console.error('Database error in getAccounts:', error);
      throw error;
    }
  },

  async createAccount(accountData) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      console.log('Creating account for user ID:', accountData.user_id);
      
      // Validate required fields
      if (!accountData.name || !accountData.user_id) {
        throw new Error('Account name and user ID are required');
      }
      
      if (isNaN(parseFloat(accountData.balance))) {
        throw new Error('Valid balance amount is required');
      }
      
      const { data, error } = await supabase
        .from('accounts')
        .insert([{
          user_id: accountData.user_id,
          name: accountData.name,
          type: accountData.type,
          balance: parseFloat(accountData.balance),
          color: accountData.color
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating account:', error);
        throw error;
      }
      console.log('Account created successfully:', data);
      return data;
    } catch (error) {
      console.error('Database error in createAccount:', error);
      throw error;
    }
  },

  async updateAccount(accountId, updates) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      console.log('Updating account ID:', accountId, 'with updates:', updates);
      const updateData = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.balance !== undefined) updateData.balance = parseFloat(updates.balance);
      if (updates.color !== undefined) updateData.color = updates.color;
      
      const { data, error } = await supabase
        .from('accounts')
        .update(updateData)
        .eq('id', accountId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating account:', error);
        throw error;
      }
      console.log('Account updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Database error in updateAccount:', error);
      throw error;
    }
  },

  async deleteAccount(accountId) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      console.log('Deleting account ID:', accountId);
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountId);
      
      if (error) {
        console.error('Error deleting account:', error);
        throw error;
      }
      console.log('Account deleted successfully');
    } catch (error) {
      console.error('Database error in deleteAccount:', error);
      throw error;
    }
  },

  // Transactions
  async getTransactions(userId) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      console.log('Getting transactions for user ID:', userId);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error getting transactions:', error);
        throw error;
      }
      console.log('Transactions retrieved for user:', data?.length || 0, 'transactions');
      return data || [];
    } catch (error) {
      console.error('Database error in getTransactions:', error);
      throw error;
    }
  },

  async createTransaction(transactionData) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      console.log('Creating transaction for user ID:', transactionData.user_id);
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          user_id: transactionData.user_id,
          account_id: transactionData.account_id,
          title: transactionData.title,
          amount: parseFloat(transactionData.amount),
          category: transactionData.category,
          type: transactionData.type,
          description: transactionData.description || null,
          date: transactionData.date || new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }
      console.log('Transaction created successfully:', data);
      return data;
    } catch (error) {
      console.error('Database error in createTransaction:', error);
      throw error;
    }
  },

  async deleteTransaction(transactionId) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      console.log('Deleting transaction ID:', transactionId);
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);
      
      if (error) {
        console.error('Error deleting transaction:', error);
        throw error;
      }
      console.log('Transaction deleted successfully');
    } catch (error) {
      console.error('Database error in deleteTransaction:', error);
      throw error;
    }
  },

  // Goals
  async getGoals(userId) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      console.log('Getting goals for user ID:', userId);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error getting goals:', error);
        throw error;
      }
      console.log('Goals retrieved for user:', data?.length || 0, 'goals');
      return data || [];
    } catch (error) {
      console.error('Database error in getGoals:', error);
      throw error;
    }
  },

  async createGoal(goalData) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      console.log('Creating goal for user ID:', goalData.user_id);
      const { data, error } = await supabase
        .from('goals')
        .insert([{
          user_id: goalData.user_id,
          title: goalData.title,
          target_amount: parseFloat(goalData.target_amount),
          current_amount: parseFloat(goalData.current_amount) || 0,
          deadline: goalData.deadline || null,
          description: goalData.description || null,
          progress: goalData.progress || 0
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating goal:', error);
        throw error;
      }
      console.log('Goal created successfully:', data);
      return data;
    } catch (error) {
      console.error('Database error in createGoal:', error);
      throw error;
    }
  },

  async updateGoal(goalId, updates) {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase not configured');
    }
    
    try {
      console.log('Updating goal ID:', goalId, 'with updates:', updates);
      const updateData = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.target_amount !== undefined) updateData.target_amount = parseFloat(updates.target_amount);
      if (updates.current_amount !== undefined) updateData.current_amount = parseFloat(updates.current_amount);
      if (updates.deadline !== undefined) updateData.deadline = updates.deadline;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.progress !== undefined) updateData.progress = parseFloat(updates.progress);
      
      const { data, error } = await supabase
        .from('goals')
        .update(updateData)
        .eq('id', goalId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating goal:', error);
        throw error;
      }
      console.log('Goal updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Database error in updateGoal:', error);
      throw error;
    }
  }
};
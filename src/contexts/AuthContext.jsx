import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, dbHelpers } from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('🔐 Checking existing session...');
        // Skip session check if Supabase is not configured
        if (!isSupabaseConfigured()) {
          console.log('⚠️ Supabase not configured, skipping session check');
          setLoading(false);
          return;
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📋 Session check result:', session ? 'Found session' : 'No session');
        if (session) {
          console.log('👤 User from session:', session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata.name || session.user.email.split('@')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
          });
        }
      } catch (error) {
        console.error('❌ Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    let subscription = null;
    if (isSupabaseConfigured()) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔐 Auth state changed:', event, 'User ID:', session?.user?.id);
          if (session) {
            const userData = {
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata.name || session.user.email.split('@')[0],
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
            };
            console.log('👤 Setting user data:', userData);
            setUser(userData);
          } else {
            console.log('👤 User logged out');
            setUser(null);
          }
          setLoading(false);
        }
      );
      subscription = data.subscription;
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Demo login - accept any password for demo@example.com
      if (email === 'demo@example.com') {
        const demoUserId = `demo-user-${crypto.randomUUID()}`;
        const demoUser = {
          id: demoUserId,
          email: email,
          name: 'Demo User',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=demo@example.com`,
        };
        console.log('🎭 Demo login for user:', demoUser.id);
        setUser(demoUser);
        localStorage.setItem(demoUserId, JSON.stringify(demoUser));
        toast.success('Welcome to the demo!');
        return true;
      }

      // Check if Supabase is configured before attempting real auth
      if (!isSupabaseConfigured()) {
        toast.error('Database not configured. Please use demo login or connect to Supabase.');
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Create user record in database if it doesn't exist
      try {
        console.log('👤 Ensuring user record exists for:', data.user.id);
        const userRecord = await dbHelpers.createUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.name || data.user.email.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`
        });
        console.log('✅ User record ensured:', userRecord);
      } catch (userError) {
        console.log('ℹ️ User record handling:', userError.message);
      }
      toast.success('Welcome back!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      
      // Check if Supabase is configured before attempting registration
      if (!isSupabaseConfigured()) {
        toast.error('Database not configured. Please connect to Supabase first.');
        return false;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) throw error;

      // Create user record in database
      if (data.user) {
        try {
          console.log('👤 Creating new user record for:', data.user.id);
          await dbHelpers.createUser({
            id: data.user.id,
            email: data.user.email,
            name: name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`
          });
          console.log('✅ New user record created successfully');
        } catch (userError) {
          console.error('❌ Error creating user record:', userError);
        }
      }
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Handle demo logout
      if (user?.id?.startsWith('demo-user-')) {
        console.log('🎭 Demo logout for user:', user.id);
        localStorage.removeItem(`demo-user-${user.id}`);
        setUser(null);
        toast.success('Logged out successfully');
        return;
      }

      console.log('🔐 Logging out user:', user?.id);
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('❌ Error logging out:', error);
      toast.error('Error logging out');
    }
  };

  // Check for demo user on mount
  useEffect(() => {
    // Check for any demo user in localStorage
    const keys = Object.keys(localStorage);
    const demoUserKey = keys.find(key => key.startsWith('demo-user-'));
    
    if (demoUserKey && !user) {
      const demoUser = localStorage.getItem(demoUserKey);
      if (demoUser) {
        console.log('🎭 Restoring demo user session');
        setUser(JSON.parse(demoUser));
      }
    }
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
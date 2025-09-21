import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData.name, formData.email, formData.password);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-2xl">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white ml-4">MyMoney</h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Take Control of Your
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent block">
                Financial Future
              </span>
            </h2>
            <p className="text-dark-300 text-lg mb-8">
              Track expenses, manage budgets, and achieve your financial goals with our intelligent money management platform.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
                <div className="text-primary-400 font-semibold">Smart Analytics</div>
                <div className="text-dark-400">AI-powered insights</div>
              </div>
              <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
                <div className="text-secondary-400 font-semibold">Secure & Private</div>
                <div className="text-dark-400">Bank-level security</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h3>
              <p className="text-dark-400">
                {isLogin ? 'Sign in to your account' : 'Start your financial journey'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                      placeholder="Enter your name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-dark-900/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-dark-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-dark-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-400 hover:text-primary-300 font-medium ml-1"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-dark-900/50 border border-dark-700 rounded-xl">
              <p className="text-xs text-dark-400 text-center mb-2">Demo Credentials:</p>
              <p className="text-xs text-dark-300 text-center">
                Email: demo@example.com | Password: any password
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const AIInsights = () => {
  const { getTotalExpenses, getCategoryData } = useData();
  
  const totalExpenses = getTotalExpenses();
  const categoryData = getCategoryData();
  const topCategory = categoryData.reduce((prev, current) => 
    (prev.value > current.value) ? prev : current, { value: 0 }
  );

  const insights = [
    {
      type: 'tip',
      icon: Lightbulb,
      title: 'Smart Saving Tip',
      message: `You spend most on ${topCategory.name || 'dining'}. Try setting a weekly limit to save more!`,
      color: 'accent'
    },
    {
      type: 'trend',
      icon: TrendingUp,
      title: 'Spending Pattern',
      message: 'You usually spend 30% more on weekends. Consider planning your weekend budget.',
      color: 'primary'
    },
    {
      type: 'alert',
      icon: AlertTriangle,
      title: 'Budget Alert',
      message: 'You\'re 85% through your monthly entertainment budget with 10 days left.',
      color: 'warning'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-6"
    >
      <div className="flex items-center mb-6">
        <Brain className="h-5 w-5 text-primary-400 mr-2" />
        <h2 className="text-xl font-bold text-white">AI Insights</h2>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-dark-900/30 rounded-xl p-4 border border-dark-700"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-${insight.color}-500/20`}>
                <insight.icon className={`h-4 w-4 text-${insight.color}-400`} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium text-sm mb-1">
                  {insight.title}
                </h3>
                <p className="text-dark-300 text-sm leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-primary-600/10 to-secondary-600/10 border border-primary-500/20 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium text-sm mb-1">
              Weekly Savings Goal
            </h3>
            <p className="text-dark-300 text-sm">
              Save ₹200 more to unlock the "Super Saver" badge!
            </p>
          </div>
          <div className="text-right">
            <div className="text-primary-400 font-bold">₹180</div>
            <div className="text-dark-400 text-xs">of ₹200</div>
          </div>
        </div>
        <div className="mt-3 w-full bg-dark-700 rounded-full h-2">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full w-[90%]"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIInsights;
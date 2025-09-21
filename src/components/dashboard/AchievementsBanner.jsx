import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Target } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const AchievementsBanner = () => {
  const { achievements } = useData();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-accent-600/20 to-primary-600/20 border border-accent-500/30 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-accent-500/20 p-3 rounded-xl">
            <Award className="h-6 w-6 text-accent-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Great progress! 🎉
            </h3>
            <p className="text-dark-300 text-sm">
              You've unlocked {unlockedCount} of {totalCount} achievements
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {achievements.slice(0, 3).map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                achievement.unlocked 
                  ? 'bg-success-500/20 border border-success-500/30' 
                  : 'bg-dark-700/50 border border-dark-600'
              }`}
            >
              {achievement.icon}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementsBanner;
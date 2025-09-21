import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const CategoryBreakdown = () => {
  const { getCategoryData } = useData();
  const data = getCategoryData();

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-6"
    >
      <div className="flex items-center mb-6">
        <PieChartIcon className="h-5 w-5 text-primary-400 mr-2" />
        <h2 className="text-xl font-bold text-white">Category Breakdown</h2>
      </div>

      {data.length > 0 ? (
        <>
          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {data.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-dark-300 text-sm">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium text-sm">
                    ₹{category.value.toLocaleString()}
                  </div>
                  <div className="text-dark-500 text-xs">
                    {((category.value / total) * 100).toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="text-dark-400 mb-2">No data available</div>
          <p className="text-dark-500 text-sm">Add some expenses to see the breakdown</p>
        </div>
      )}
    </motion.div>
  );
};

export default CategoryBreakdown;
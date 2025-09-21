import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const TransactionChart = () => {
  const [chartType, setChartType] = useState('line');
  const [period, setPeriod] = useState('7d');
  const { getChartData } = useData();

  const data = getChartData(period);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-3 shadow-xl">
          <p className="text-dark-300 text-sm mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <span className="text-sm" style={{ color: entry.color }}>
                {entry.dataKey === 'income' ? 'Income' : entry.dataKey === 'expenses' ? 'Expenses' : 'Net'}
              </span>
              <span className="font-medium text-white">
                ₹{Math.abs(entry.value).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-dark-800/40 backdrop-blur-xl border border-dark-700 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Financial Overview</h2>
          <p className="text-dark-400 text-sm">Track your income and expenses over time</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Period selector */}
          <div className="flex bg-dark-900/50 rounded-xl p-1">
            {['7d', '30d', '1y'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-sm rounded-lg transition-all ${
                  period === p
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          
          {/* Chart type selector */}
          <div className="flex bg-dark-900/50 rounded-xl p-1">
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-lg transition-all ${
                chartType === 'line'
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-lg transition-all ${
                chartType === 'bar'
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#22c55e" radius={[2, 2, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TransactionChart;
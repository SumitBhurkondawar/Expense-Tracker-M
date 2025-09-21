import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import DashboardHome from '../components/dashboard/DashboardHome';
import TransactionsPage from '../components/transactions/TransactionsPage';
import AnalyticsPage from '../components/analytics/AnalyticsPage';
import AccountsPage from '../components/accounts/AccountsPage';
import SettingsPage from '../components/settings/SettingsPage';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-dark-950 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnnouncementProvider } from './components/AnnouncementContext';
import Admin from './pages/Admin';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Users from './components/Users';
import Auction from './components/Auction';
import TransactionReports from './components/TransactionReports';
import FullReport from './components/FullReport';
import Login from './components/Login'; 
import './index.css';

function App() {
  return (
    <AnnouncementProvider>
      <Router>
        <Routes>
          {/* Admin layout with nested routes */}
          <Route path="/admin" element={<Admin />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="users" element={<Users />} />
            <Route path="auction" element={<Auction />} />
            <Route path="transaction-reports" element={<TransactionReports />} />
            <Route path="full-report" element={<FullReport />} />
          </Route>

          {/* Public route */}
          <Route path="/" element={<Login />} />

          {/* 404 Not Found Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AnnouncementProvider>
  );
}

export default App;
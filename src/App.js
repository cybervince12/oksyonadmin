import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './pages/Admin';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Users from './components/Users';
import Auction from './components/Auction';
import TransactionReports from './components/TransactionReports';
import Login from './components/Login'; 
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin layout with nested routes */}
        <Route path="/admin" element={<Admin />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="users" element={<Users />} />
          <Route path="auction" element={<Auction />} />
          <Route path="transaction-reports" element={<TransactionReports />} />
        </Route>

        {/* Public routes */}
        <Route path="/" element={<Login />} /> {/* Add your login component */}
      </Routes>
    </Router>
  );
}

export default App;

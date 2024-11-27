import React from 'react';
import TopHeader from '../components/TopHeader';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const Admin = () => {
  const handleSearch = (query) => {
    console.log('Search initiated for:', query);
  };

  return (
    <div>
      {/* Sidebar */}
      <Sidebar />

      {/* Top Header */}
      <TopHeader title="Admin Dashboard" onSearch={handleSearch} />

      {/* Main Content */}
      <div className="ml-64 pt-[88px] p-4">
        <Outlet /> {/* Nested routes go here */}
      </div>
    </div>
  );
};

export default Admin;

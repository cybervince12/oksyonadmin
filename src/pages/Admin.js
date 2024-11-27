import React from 'react';
import Sidebar from '../components/Sidebar'; // Sidebar component
import { Outlet } from 'react-router-dom'; // For nested routes

const Admin = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar is fixed on the left */}
      <Sidebar />
      {/* Main content area with left margin to account for the sidebar */}
      <main className="flex-1 ml-64 p-6 bg-gray-100 overflow-auto">
        <Outlet /> {/* This will render the nested routes like Dashboard, Transactions, etc. */}
      </main>
    </div>
  );
};

export default Admin;

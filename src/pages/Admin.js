import React from 'react';
import Sidebar from '../components/Sidebar'; // Sidebar component
import { Outlet } from 'react-router-dom'; // For nested routes

const Admin = () => {
  return (
    <div className="flex">
      {/* Sidebar is fixed on the left */}
      <Sidebar />
      {/* Main content where the Outlet renders child components */}
      <div className="flex-1 p-4">
        <Outlet /> {/* This will render the nested routes like Dashboard, Transactions, etc. */}
      </div>
    </div>
  );
};

export default Admin;

import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faGavel, faUsers, faEnvelope, faFileAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <aside className="bg-gradient-to-b from-[#257446] to-[#234D35] text-white h-screen w-64 p-6">
      <h2 className="text-lg font-bold mb-6">ADMIN</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/admin/dashboard" className="flex items-center space-x-2 py-2 hover:bg-green-700 rounded px-2">
            <FontAwesomeIcon icon={faHome} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/transactions" className="flex items-center space-x-2 py-2 hover:bg-green-700 rounded px-2">
            <FontAwesomeIcon icon={faGavel} />
            <span>Transactions</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/auction" className="flex items-center space-x-2 py-2 hover:bg-green-700 rounded px-2">
            <FontAwesomeIcon icon={faFileAlt} />
            <span>Auction</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="flex items-center space-x-2 py-2 hover:bg-green-700 rounded px-2">
            <FontAwesomeIcon icon={faUsers} />
            <span>Users</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/inbox" className="flex items-center space-x-2 py-2 hover:bg-green-700 rounded px-2">
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Inbox</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/transaction-reports" className="flex items-center space-x-2 py-2 hover:bg-green-700 rounded px-2">
            <FontAwesomeIcon icon={faFileAlt} />
            <span>Transaction Reports</span>
          </Link>
        </li>
        <li>
          <Link to="/sign-out" className="flex items-center space-x-2 py-2 hover:bg-green-700 rounded px-2">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Sign Out</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;

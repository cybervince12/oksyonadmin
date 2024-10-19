import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faGavel, faUsers, faEnvelope, faFileAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const navigate = useNavigate(); 

  const handleSignOut = () => {
    // Add any sign-out logic here (e.g., clearing session, tokens, etc.)
    navigate('/login'); // Navigate to the login page after sign out
  };

  return (
    <aside className="bg-gradient-to-b from-[#257446] to-[#234D35] text-white w-64 p-6">
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
          {/* Button for sign out */}
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 py-2 hover:bg-green-700 rounded px-2 w-full text-left"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Sign Out</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;

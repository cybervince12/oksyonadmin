import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faGavel,
  faUsers,
  faFileAlt,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <aside className="bg-gradient-to-b from-[#257446] to-[#234D35] text-white h-screen fixed top-0 left-0 overflow-y-auto transition-all duration-300 lg:w-64 w-14">
    <div className="p-2 lg:p-6 flex flex-col items-center lg:items-start">
    <h2 className="text-xs lg:text-lg font-bold mb-6 hidden lg:block">ADMIN</h2>
    <ul className="space-y-4 w-full">
          <li>
            <Link
              to="/admin/dashboard"
              className="flex items-center space-x-2 lg:space-x-4 py-2 hover:bg-green-700 rounded px-2 w-full justify-center lg:justify-start"
            >
              <FontAwesomeIcon icon={faHome} className="text-lg" />
              <span className="hidden lg:block text-sm">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/transactions"
              className="flex items-center space-x-2 lg:space-x-4 py-2 hover:bg-green-700 rounded px-2 w-full justify-center lg:justify-start"
            >
              <FontAwesomeIcon icon={faGavel} className="text-lg" />
              <span className="hidden lg:block text-sm">Transactions</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/auction"
              className="flex items-center space-x-2 lg:space-x-4 py-2 hover:bg-green-700 rounded px-2 w-full justify-center lg:justify-start"
            >
              <FontAwesomeIcon icon={faFileAlt} className="text-lg" />
              <span className="hidden lg:block text-sm">Auction</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="flex items-center space-x-2 lg:space-x-4 py-2 hover:bg-green-700 rounded px-2 w-full justify-center lg:justify-start"
            >
              <FontAwesomeIcon icon={faUsers} className="text-lg" />
              <span className="hidden lg:block text-sm">Users</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/transaction-reports"
              className="flex items-center space-x-2 lg:space-x-4 py-2 hover:bg-green-700 rounded px-2 w-full justify-center lg:justify-start"
            >
              <FontAwesomeIcon icon={faFileAlt} className="text-lg" />
              <span className="hidden lg:block text-sm">Transaction Reports</span>
            </Link>
          </li>
          <li>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 lg:space-x-4 py-2 hover:bg-green-700 rounded px-2 w-full justify-center lg:justify-start"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
              <span className="hidden lg:block text-sm">Sign Out</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

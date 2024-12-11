import React, { useState } from 'react';
import { FaSearch, FaCog, FaBell } from 'react-icons/fa';

const TopHeader = ({ title, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      console.log('Search query:', searchQuery);
    }
  };

  return (
    <div className="fixed top-0 left-16 lg:left-64 w-[calc(100%-4rem)] lg:w-[calc(100%-16rem)] z-50 p-4 lg:p-6 bg-white shadow-md flex justify-between items-center">
      {/* Title */}
      <h1 className="text-xl lg:text-3xl font-bold text-green-800">{title}</h1>

      {/* Search Bar */}
      <div className="hidden sm:flex flex-grow justify-center">
        <div className="relative w-full max-w-lg">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch
              className="text-green-800 cursor-pointer"
              onClick={handleSearch}
              title="Search"
            />
          </span>
          <input
            type="text"
            placeholder="Search for something..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100 text-gray-700 w-full"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          className="bg-gray-200 p-2 lg:p-3 rounded-full hover:bg-gray-300 transition"
          aria-label="Settings"
          title="Settings"
        >
          <FaCog className="text-green-700" />
        </button>
        <button
          className="bg-gray-200 p-2 lg:p-3 rounded-full hover:bg-gray-300 transition"
          aria-label="Notifications"
          title="Notifications"
        >
          <FaBell className="text-green-700" />
        </button>

        {/* Profile Section */}
        <div className="hidden sm:flex items-center gap-2">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800 text-sm lg:text-base">Grechelle Boneo</p>
            <p className="text-xs lg:text-sm text-green-700">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;

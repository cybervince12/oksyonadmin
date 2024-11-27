import React, { useState } from 'react';
import { FaSearch, FaCog, FaBell } from 'react-icons/fa';

const TopHeader = ({ title, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery); // Trigger the search callback with the query
    } else {
      console.log('Search query:', searchQuery); // Fallback for debugging
    }
  };

  return (
    <div className="p-6 bg-white shadow-md flex justify-between items-center">
      <h1 className="text-3xl font-bold text-green-800">{title}</h1>

      {/* Centered Search Input with Icon */}
      <div className="flex-grow flex justify-center">
        <div className="relative w-full max-w-lg">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch
              className="text-green-800 cursor-pointer"
              onClick={handleSearch} // Trigger search on icon click
            />
          </span>
          <input
            type="text"
            placeholder="Search for something..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update state on input
            className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-200 text-gray-700 w-full"
          />
        </div>
      </div>

      {/* Icons and User Profile */}
      <div className="flex items-center gap-4">
        {/* Settings Icon */}
        <button className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition">
          <FaCog className="text-green-700" />
        </button>

        {/* Notifications Icon */}
        <button className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition">
          <FaBell className="text-green-700" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800">Grechelle Boneo</p>
            <p className="text-sm text-green-700">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;

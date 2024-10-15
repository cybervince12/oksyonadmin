import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const data = {
    labels: ['Carabao', 'Cattle', 'Goat', 'Horse', 'Hogs'],
    datasets: [
      {
        label: 'Weekly Dashboard',
        data: [507, 592, 71, 31, 0],
        backgroundColor: ['#ffce56', '#36a2eb', '#ff6384', '#4bc0c0', '#9966ff'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="w-4/5 p-6 bg-gray-100">
        {/* Top Section with Search */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome, Grechelle Boneo</h1>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search for something..."
              className="border rounded p-2 mr-2 focus:outline-none focus:ring focus:ring-green-500"
            />
            <button className="bg-green-500 text-white p-2 rounded hover:bg-green-700 transition duration-200">
              Search
            </button>
          </div>
        </div>

        {/* Key Metrics, Recent Activities, and Announcements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Key Metrics */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-4">Key Metrics</h2>
            <ul className="space-y-2">
              <li>Active Users: <span className="font-bold">1000</span></li>
              <li>Upcoming Auctions: <span className="font-bold">120</span></li>
              <li>Live Auctions: <span className="font-bold">80</span></li>
              <li>Completed Transactions: <span className="font-bold">100</span></li>
            </ul>
          </div>

          {/* Recent Activities */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-4">Recent Activities</h2>
            <ul className="space-y-2">
              <li>- Noto Sans registered as a new user</li>
              <li>- Auction "Sheep Sale" completed</li>
              <li>- New auction "Cattle Sale" created</li>
            </ul>
          </div>

          {/* Announcements */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg">Add New Announcement</h2>
              <button className="bg-green-500 p-2 rounded-full text-white">+</button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Announcements:</h3>
              <p>Upcoming auction - Monday</p>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-4">Weekly Dashboard - Livestock Sold</h2>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

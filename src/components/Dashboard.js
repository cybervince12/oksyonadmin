import React, { useState } from 'react';
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
import TopHeader from './TopHeader';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementDate, setAnnouncementDate] = useState('');
  const [announcementTime, setAnnouncementTime] = useState('');
  const [announcements, setAnnouncements] = useState([
    { text: 'Upcoming auction - Monday' },
  ]);

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

  const handleAddAnnouncement = () => {
    setShowAnnouncementForm(true);
  };

  const handleSaveAnnouncement = () => {
    setAnnouncements([...announcements, { text: announcementText, date: announcementDate, time: announcementTime }]);
    setShowAnnouncementForm(false);
    setAnnouncementText('');
    setAnnouncementDate('');
    setAnnouncementTime('');
  };

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex flex-col w-full">
        {/* Top Header */}
        <TopHeader title="Dashboard" />

        {/* Content */}
        <div className="flex-grow p-6 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Key Metrics */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4 text-green-800">Key Metrics</h2>
              <ul className="space-y-2">
                <li>Active Users: <span className="font-bold">1000</span></li>
                <li>Upcoming Auctions: <span className="font-bold">120</span></li>
                <li>Live Auctions: <span className="font-bold">80</span></li>
                <li>Completed Transactions: <span className="font-bold">100</span></li>
              </ul>
            </div>

            {/* Recent Activities */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4 text-green-800">Recent Activities</h2>
              <ul className="space-y-2">
                <li>- Noto Sans registered as a new user</li>
                <li>- Auction "Sheep Sale" completed</li>
                <li>- New auction "Cattle Sale" created</li>
              </ul>
            </div>

            {/* Announcements */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg text-green-800">Announcements</h2>
                <button
                  className="bg-green-500 w-10 h-10 flex items-center justify-center rounded-lg text-white"
                  onClick={handleAddAnnouncement}
                >
                  +
                </button>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">Current Announcements:</h3>
                <ul>
                  {announcements.map((announcement, index) => (
                    <li key={index}>
                      {announcement.text} - {announcement.date} at {announcement.time}
                    </li>
                  ))}
                </ul>
              </div>

              
            </div>
          </div>
                    
          {/* Show Add Announcement Form */}
{showAnnouncementForm && (
  <div className="bg-white shadow-md rounded-lg p-4">
    <h2 className="font-semibold text-lg text-green-800">Add New Announcement</h2>
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">Date:</label>
      <input
        type="date"
        className="w-full p-2 border border-gray-300 rounded-lg"
        value={announcementDate}
        onChange={(e) => setAnnouncementDate(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">Time:</label>
      <input
        type="time"
        className="w-full p-2 border border-gray-300 rounded-lg"
        value={announcementTime}
        onChange={(e) => setAnnouncementTime(e.target.value)}
      />
    </div>
    <textarea
      className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
      rows="4"
      placeholder="Write your announcement here..."
      value={announcementText}
      onChange={(e) => setAnnouncementText(e.target.value)}
    />
    <div className="flex justify-between items-center mt-4">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg"
        onClick={handleSaveAnnouncement}
      >
        Save Announcement
      </button>

      {/* Add the buttons inline */}
      <div className="flex space-x-2">
        <button className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg">
          send to bidders account
        </button>
        <button className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg">
          send to sellers account
        </button>
        <button className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg">
          send to bidder/sellers account
        </button>
      </div>
    </div>
  </div>
)}


          {/* Bar Chart */}
          <div className="bg-white shadow-md rounded-lg p-4 mt-6">
            <h2 className="text-2xl font-bold">Weekly Dashboard - Livestock Sold</h2>
            <p className="text-gray-500">14/04/2024 - 20/04/2024</p>
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

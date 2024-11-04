import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { supabase } from '../supabaseClient';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementDate, setAnnouncementDate] = useState('');
  const [announcementTime, setAnnouncementTime] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

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
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Fetch announcements on component mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error.message);
        setErrorMessage('Failed to fetch announcements. Please try again later.');
      } else {
        setAnnouncements(data);
      }
    };

    fetchAnnouncements();
  }, []);

  // Function to handle saving a new announcement
  const handleSaveAnnouncement = async () => {
    if (!announcementText || !announcementDate || !announcementTime) {
      console.error('All fields must be filled');
      setErrorMessage('Please fill out all fields before saving.');
      return;
    }

    const newAnnouncement = {
      text: announcementText,
      date: announcementDate,
      time: announcementTime,
    };

    const { data, error } = await supabase
      .from('announcements')
      .insert([newAnnouncement])
      .select('*'); // Return inserted data for immediate update

    if (error) {
      console.error('Error saving announcement:', error.message);
      setErrorMessage('Failed to save the announcement. Please try again.');
    } else {
      setAnnouncements((prevAnnouncements) => [data[0], ...prevAnnouncements]); // Add new announcement
      setShowAnnouncementForm(false);
      setAnnouncementText('');
      setAnnouncementDate('');
      setAnnouncementTime('');
      setErrorMessage(null); // Clear any previous errors
    }
  };

  const handleAddAnnouncement = () => {
    setShowAnnouncementForm(true);
    setErrorMessage(null); // Clear errors when opening the form
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
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-green-800">Add New Announcement</h2>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setShowAnnouncementForm(false)}
                >
                  CLOSE
                </button>
              </div>
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
                <div className="flex space-x-2">
                  <button className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg">
                    Send to Bidders Account
                  </button>
                  <button className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg">
                    Send to Sellers Account
                  </button>
                  <button className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg">
                    Send to Bidder/Sellers Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bar Chart */}
          <div className="bg-white shadow-md rounded-lg p-4 mt-6">
            <h2 className="text-2xl font-bold">Weekly Dashboard - Livestock Sold</h2>
            <p className="text-gray-500">14/04/2024 - 20/04/2024</p>
            <div className="h-96"> {/* Set height here */}
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

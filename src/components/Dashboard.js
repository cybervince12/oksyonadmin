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
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [upcomingAuctions, setUpcomingAuctions] = useState(0);
  const [liveAuctions, setLiveAuctions] = useState(0);
  const [completedTransactions, setCompletedTransactions] = useState(0);

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

  useEffect(() => {
    const fetchProfilesCount = async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching active users count:', error.message);
        setErrorMessage('Failed to fetch active users count. Please try again later.');
      } else {
        setActiveUsersCount(count);
      }
    };

    fetchProfilesCount();
  }, []);

  useEffect(() => {
    const fetchAuctionData = async () => {
      const { data, error } = await supabase
        .from('livestock') // Assuming 'livestock' is the correct table name for auction data
        .select('*');

      if (error) {
        console.error('Error fetching auction data:', error.message);
        setErrorMessage('Failed to fetch auction data. Please try again later.');
      } else {
        // Count the auctions based on their status
        const pendingCount = data.filter((livestock) => livestock.status === 'PENDING').length;
        const availableCount = data.filter((livestock) => livestock.status === 'AVAILABLE').length;
        const soldCount = data.filter((livestock) => livestock.status === 'SOLD').length;

        setUpcomingAuctions(pendingCount); // Set the count for Upcoming Auctions (PENDING)
        setLiveAuctions(availableCount); // Set the count for Live Auctions (AVAILABLE)
        setCompletedTransactions(soldCount); // Set the count for Completed Transactions (SOLD)
      }
    };

    fetchAuctionData();
  }, []);

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
      .select('*');

    if (error) {
      console.error('Error saving announcement:', error.message);
      setErrorMessage('Failed to save the announcement. Please try again.');
    } else {
      setAnnouncements((prevAnnouncements) => [data[0], ...prevAnnouncements]);
      setShowAnnouncementForm(false);
      setAnnouncementText('');
      setAnnouncementDate('');
      setAnnouncementTime('');
      setErrorMessage(null);
    }
  };

  const handleAddAnnouncement = () => {
    setShowAnnouncementForm(true);
    setErrorMessage(null);
  };

  const toggleShowAllAnnouncements = () => {
    setShowAllAnnouncements(!showAllAnnouncements);
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col w-full">
        <TopHeader title="Dashboard" />

        <div className="flex-grow p-6 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4 text-green-800">Key Metrics</h2>
              <ul className="space-y-2">
                <li>Active Users: <span className="font-bold">{activeUsersCount}</span></li>
                <li>Upcoming Auctions: <span className="font-bold">{upcomingAuctions}</span></li>
                <li>Live Auctions: <span className="font-bold">{liveAuctions}</span></li>
                <li>Completed Transactions: <span className="font-bold">{completedTransactions}</span></li>
              </ul>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-4 text-green-800">Recent Activities</h2>
              <ul className="space-y-2">
                <li>- Noto Sans registered as a new user</li>
                <li>- Auction "Sheep Sale" completed</li>
                <li>- New auction "Cattle Sale" created</li>
              </ul>
            </div>

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
                <h3 className="font-semibold text-lg text-green-800 mb-4">Latest Announcement:</h3>
                {announcements.length > 0 ? (
                  <div className="bg-gray-50 border-l-4 border-green-500 p-4 rounded-md shadow-md">
                    <h4 className="text-sm text-black-700">{announcements[0].text}</h4>
                    <p className="text-sm text-gray-500">
                      {announcements[0].date}  {announcements[0].time}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">No announcements available at the moment.</p>
                )}
                <button
                  className="text-blue-500 mt-4"
                  onClick={toggleShowAllAnnouncements}
                >
                  {showAllAnnouncements ? 'Hide All Announcements' : 'View All Announcements'}
                </button>
                {showAllAnnouncements && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg text-green-800 mb-4">All Announcements:</h3>
                    <ul className="space-y-2">
                      {announcements.map((announcement, index) => (
                        <li key={index} className="bg-gray-50 border-l-4 border-green-500 p-2 rounded-md shadow-sm">
                          <p>{announcement.text}</p>
                          <p className="text-xs text-gray-500">{announcement.date} {announcement.time}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-4 text-green-800">Weekly Summary</h2>
            <div className="h-64">
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>

        {showAnnouncementForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full md:w-1/3">
              <h2 className="font-semibold text-xl text-green-800 mb-4">Create Announcement</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Announcement Text</label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={announcementDate}
                    onChange={(e) => setAnnouncementDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    value={announcementTime}
                    onChange={(e) => setAnnouncementTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => setShowAnnouncementForm(false)}
                    className="text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAnnouncement}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

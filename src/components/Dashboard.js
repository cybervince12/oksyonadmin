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

  const [livestockData, setLivestockData] = useState({
    labels: ['Carabao', 'Cattle', 'Goat', 'Horse', 'Pig', 'Sheep'],
    datasets: [
      {
        label: 'Weekly Transactions',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: ['#ffce56', '#36a2eb', '#ff6384', '#4bc0c0', '#9966ff', '#ff9f40'],
        borderWidth: 1,
      },
    ],
  });

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
        .from('livestock')
        .select('*');

      if (error) {
        console.error('Error fetching auction data:', error.message);
        setErrorMessage('Failed to fetch auction data. Please try again later.');
      } else {
        const categoriesCount = ['Carabao', 'Cattle', 'Goat', 'Horse', 'Pig', 'Sheep'].map((category) => {
          return data.filter((livestock) => livestock.category === category).length;
        });

        setLivestockData({
          labels: ['Carabao', 'Cattle', 'Goat', 'Horse', 'Pig', 'Sheep'],
          datasets: [
            {
              label: 'Weekly Transactions',
              data: categoriesCount,
              backgroundColor: ['#ffce56', '#36a2eb', '#ff6384', '#4bc0c0', '#9966ff', '#ff9f40'],
              borderWidth: 1,
            },
          ],
        });

        const pendingCount = data.filter((livestock) => livestock.status === 'PENDING').length;
        const availableCount = data.filter((livestock) => livestock.status === 'AVAILABLE').length;
        const soldCount = data.filter((livestock) => livestock.status === 'SOLD').length;

        setUpcomingAuctions(pendingCount);
        setLiveAuctions(availableCount);
        setCompletedTransactions(soldCount);
      }
    };

    fetchAuctionData();
  }, []);

  const handleSaveAnnouncement = async () => {
    if (!announcementText || !announcementDate || !announcementTime) {
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
                <li>Pending Auctions: <span className="font-bold">{upcomingAuctions}</span></li>
                <li>Ongoing Auctions: <span className="font-bold">{liveAuctions}</span></li>
                <li>Finished Transactions: <span className="font-bold">{completedTransactions}</span></li>
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
                      {announcements[0].date} {announcements[0].time}
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
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border-b border-gray-300 py-2">
                        <p className="text-sm">{announcement.text}</p>
                        <p className="text-xs text-gray-500">{announcement.date} {announcement.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-lg text-green-800">Weekly Transactions</h2>
            <div className="h-72">
              <Bar data={livestockData} options={options} />
            </div>
          </div>
        </div>

        {showAnnouncementForm && (
          <div className="bg-white shadow-md p-6 rounded-lg fixed bottom-0 left-0 right-0 z-10">
            <h2 className="font-semibold text-lg text-green-800">New Announcement</h2>
            <form>
              <textarea
                className="w-full p-4 border rounded-md mb-4"
                rows="3"
                placeholder="Enter announcement text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
              />
              <input
                type="date"
                className="w-full p-4 border rounded-md mb-4"
                value={announcementDate}
                onChange={(e) => setAnnouncementDate(e.target.value)}
              />
              <input
                type="time"
                className="w-full p-4 border rounded-md mb-4"
                value={announcementTime}
                onChange={(e) => setAnnouncementTime(e.target.value)}
              />
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg"
                  onClick={handleSaveAnnouncement}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="ml-4 text-red-500"
                  onClick={() => setShowAnnouncementForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

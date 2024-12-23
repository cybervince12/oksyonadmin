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
import { Users, Clock, PlayCircle, CheckCircle, Bell } from 'lucide-react';
import TopHeader from './TopHeader';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    text: '',
    date: '',
    time: '',
  });
  const [announcements, setAnnouncements] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false); 
  const [metrics, setMetrics] = useState({
    activeUsersCount: 0,
    upcomingAuctions: 0,
    liveAuctions: 0,
    completedTransactions: 0,
  });
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
  };

  const fetchData = async () => {
    try {
      const [{ data: announcements, error: announcementsError }, { count: activeUsersCount, error: usersError }, { data: livestock, error: livestockError }] =
        await Promise.all([
          supabase.from('announcements').select('*').order('created_at', { ascending: false }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('livestock').select('*'),
        ]);

      if (announcementsError || usersError || livestockError) {
        throw new Error('Error fetching data');
      }

      setAnnouncements(announcements);
      setMetrics((prev) => ({
        ...prev,
        activeUsersCount,
      }));

      const livestockCounts = ['Carabao', 'Cattle', 'Goat', 'Horse', 'Pig', 'Sheep'].map(
        (category) => livestock.filter((item) => item.category === category).length
      );

      const pending = livestock.filter((item) => item.status === 'PENDING').length;
      const available = livestock.filter((item) => item.status === 'AVAILABLE').length;
      const sold = livestock.filter((item) => item.status === 'SOLD').length;

      setMetrics((prev) => ({
        ...prev,
        upcomingAuctions: pending,
        liveAuctions: available,
        completedTransactions: sold,
      }));

      setLivestockData((prev) => ({
        ...prev,
        datasets: [{ ...prev.datasets[0], data: livestockCounts }],
      }));
    } catch (error) {
      setErrorMessage('Failed to fetch data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveAnnouncement = async () => {
    const { text, date, time } = announcementForm;

    if (!text || !date || !time) {
      setErrorMessage('Please fill out all fields before saving.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{ text, date, time }])
        .select('*');

      if (error) throw error;

      setAnnouncements((prev) => [data[0], ...prev]);
      setShowAnnouncementForm(false);
      setAnnouncementForm({ text: '', date: '', time: '' });
      setErrorMessage(null);
    } catch {
      setErrorMessage('Failed to save the announcement. Please try again.');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col w-full">
        <TopHeader title="Dashboard" />
        <div className="flex-grow p-6 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[
              { icon: Users, label: 'Active Users', value: metrics.activeUsersCount },
              { icon: Clock, label: 'Pending Auctions', value: metrics.upcomingAuctions },
              { icon: PlayCircle, label: 'Ongoing Auctions', value: metrics.liveAuctions },
              { icon: CheckCircle, label: 'Finished Transactions', value: metrics.completedTransactions },
            ].map((metric, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <metric.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
              <h2 className="font-semibold text-lg text-green-800 mb-4">Weekly Transactions</h2>
              <div className="h-72">
                <Bar data={livestockData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-green-600" />
                  <h2 className="font-semibold text-lg text-green-800">Announcements</h2>
                </div>
                <button
                  className="bg-green-500 hover:bg-green-600 w-8 h-8 flex items-center justify-center rounded-lg text-white transition-colors"
                  onClick={() => setShowAnnouncementForm(true)}
                >
                  +
                </button>
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <div className="mt-4">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => setShowAllAnnouncements(!showAllAnnouncements)}
              >
                {showAllAnnouncements ? 'Show Recent Announcement' : 'View All Announcements'}
              </button>
                {showAllAnnouncements ? (
                  <div>
                    {announcements.length > 0 ? (
                      announcements.map((announcement) => (
                        <div
                          key={announcement.id}
                          className="bg-gray-50 border-l-4 border-green-500 p-4 rounded-md shadow-sm hover:shadow-md transition-shadow mb-4"
                        >
                          <p className="text-gray-800 mb-2">{announcement.text}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-4 h-4 mr-2" />
                            {announcement.date} at {announcement.time}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No announcements available.</p>
                    )}
                  </div>
                ) : (
                  announcements.length > 0 && (
                    <div className="bg-gray-50 border-l-4 border-green-500 p-4 rounded-md shadow-md">
                      <p className="text-gray-800 mb-2">{announcements[0].text}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {announcements[0].date} at {announcements[0].time}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        {showAnnouncementForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-green-800">New Announcement</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowAnnouncementForm(false)}
                >
                  ×
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Announcement Text
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter announcement text"
                    value={announcementForm.text}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, text: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={announcementForm.date}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={announcementForm.time}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, time: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowAnnouncementForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    onClick={handleSaveAnnouncement}
                  >
                    Save Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

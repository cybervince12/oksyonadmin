import React, { useState } from 'react';
import TopHeader from './TopHeader';

const TransactionReports = () => {
  const [showFullReport, setShowFullReport] = useState(false);

  const reportData = [
    { species: 'Carabao', registered: 507, sold: 507, unsold: 0 },
    { species: 'Cattle', registered: 592, sold: 592, unsold: 0 },
    { species: 'Horse', registered: 31, sold: 31, unsold: 0 },
    { species: 'Goat', registered: 77, sold: 77, unsold: 0 },
    { species: 'Hogs', registered: 0, sold: 0, unsold: 0 },
  ];

  // Full report data based on your image
  const fullReportData = {
    weeklyTotals: [
      { week: "03/04/2024", carabao: 116, cattle: 137, horse: 6, goat: 24, total: 283, documentaryTask: 228, income: '₱7,770' },
      { week: "03/11/2024", carabao: 92, cattle: 127, horse: 9, goat: 20, total: 248, documentaryTask: 228, income: '₱6,840' },
      { week: "03/18/2024", carabao: 136, cattle: 133, horse: 15, goat: 5, total: 289, documentaryTask: 274, income: '₱9,220' },
      { week: "03/25/2024", carabao: 163, cattle: 195, horse: 11, goat: 18, total: 387, documentaryTask: 369, income: '₱11,070' }
    ],
    totalIncome: '₱33,900.00',
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Apply TopHeader component */}
      <TopHeader title="Transaction Reports" />

      {/* Main Content */}
      <div className="p-6 bg-gray-100 flex-grow flex flex-col space-y-4">
        {/* Report Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Weekly Animal Transaction Report</h1>
          <p className="text-gray-500">for the month of</p>
          <p className="text-gray-500">Species: Large animals</p>
          <p className="text-gray-500">No. of Animals</p>
        </div>

        {/* Two-column Layout */}
        <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Left Side: Species Table */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-green-800 text-white">
                    <th className="p-3 border">Species</th>
                    <th className="p-3 border">Registered</th>
                    <th className="p-3 border">Sold</th>
                    <th className="p-3 border">Unsold</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3 text-gray-700">{item.species}</td>
                      <td className="p-3 text-gray-700">{item.registered}</td>
                      <td className="p-3 text-gray-700">{item.sold}</td>
                      <td className="p-3 text-gray-700">{item.unsold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
              <p className="font-bold text-lg text-gray-800">Income</p>
              <p className="text-sm text-gray-500">Jan 01 - Dec 31</p>
              {/* Placeholder for the chart */}
              <div className="bg-gray-200 h-32 mt-4 flex items-center justify-center">
                <p>Chart Placeholder</p>
              </div>
              <button
                className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded"
                onClick={() => setShowFullReport(!showFullReport)}
              >
                {showFullReport ? 'Hide full report' : 'View full report'}
              </button>
            </div>
          </div>

          {/* Right Side: Livestock Prices - Placeholder */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-800">Prevailing average prices as of April 2024</h2>
              <p className="text-gray-500 mt-4">Data not available. Please update this table with the correct values when ready.</p>
              <table className="w-full table-auto border-collapse mt-4">
                <thead>
                  <tr className="bg-green-800 text-white">
                    <th className="p-3">Livestock</th>
                    <th className="p-3">Average per Kilo</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Placeholder for actual data */}
                  <tr className="border-t">
                    <td className="p-3 text-gray-700">Cattle</td>
                    <td className="p-3 text-gray-700">??</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 text-gray-700">Carabao</td>
                    <td className="p-3 text-gray-700">??</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 text-gray-700">Horse</td>
                    <td className="p-3 text-gray-700">??</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 text-gray-700">Goat</td>
                    <td className="p-3 text-gray-700">??</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 text-gray-700">Hog</td>
                    <td className="p-3 text-gray-700">??</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Full Report Data */}
        {showFullReport && (
          <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <h2 className="text-lg font-bold text-gray-800">Full Weekly Report</h2>
            <table className="w-full table-auto border-collapse mt-4">
              <thead>
                <tr className="bg-green-800 text-white">
                  <th className="p-3">Week</th>
                  <th className="p-3">Carabao</th>
                  <th className="p-3">Cattle</th>
                  <th className="p-3">Horse</th>
                  <th className="p-3">Goat</th>
                  <th className="p-3">Total Livestock</th>
                  <th className="p-3">Documentary Task</th>
                  <th className="p-3">Income</th>
                </tr>
              </thead>
              <tbody>
                {fullReportData.weeklyTotals.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3 text-gray-700">{item.week}</td>
                    <td className="p-3 text-gray-700">{item.carabao}</td>
                    <td className="p-3 text-gray-700">{item.cattle}</td>
                    <td className="p-3 text-gray-700">{item.horse}</td>
                    <td className="p-3 text-gray-700">{item.goat}</td>
                    <td className="p-3 text-gray-700">{item.total}</td>
                    <td className="p-3 text-gray-700">{item.documentaryTask}</td>
                    <td className="p-3 text-gray-700">{item.income}</td>
                  </tr>
                ))}
                <tr className="border-t font-bold bg-gray-100">
                  <td className="p-3">TOTAL</td>
                  <td className="p-3 text-gray-800">507</td>
                  <td className="p-3 text-gray-800">592</td>
                  <td className="p-3 text-gray-800">31</td>
                  <td className="p-3 text-gray-800">77</td>
                  <td className="p-3 text-gray-800">1207</td>
                  <td className="p-3"></td>
                  <td className="p-3 text-gray-800">{fullReportData.totalIncome}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionReports;

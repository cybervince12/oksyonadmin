import React from 'react';
import TopHeader from './TopHeader';

const TransactionReports = () => {
  const reportData = [
    { species: 'Carabao', registered: 507, sold: 507, unsold: 0 },
    { species: 'Cattle', registered: 592, sold: 592, unsold: 0 },
    { species: 'Horse', registered: 31, sold: 31, unsold: 0 },
    { species: 'Goat', registered: 77, sold: 77, unsold: 0 },
    { species: 'Hogs', registered: 0, sold: 0, unsold: 0 },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Apply TopHeader component */}
      <TopHeader title="Transaction Reports" />

      {/* Main Content */}
      <div className="p-6 bg-gray-100 flex-grow flex flex-col space-y-4">
        {/* Report Header */}
        <div>
          <h1 className="text-2xl font-bold">Weekly Animal Transaction Report</h1>
          <p className="text-gray-500">for the month of</p>
          <p className="text-gray-500">Species: Large animals</p>
          <p className="text-gray-500">No. of Animals</p>
        </div>

        {/* Two-column Layout */}
        <div className="flex justify-between space-x-6">
          {/* Left Side: Species Table */}
          <div className="w-1/2">
            <div className="bg-white shadow-md rounded-lg p-4">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-green-800 text-white text-left">
                    <th className="p-3 border">Species</th>
                    <th className="p-3 border">Registered</th>
                    <th className="p-3 border">Sold</th>
                    <th className="p-3 border">Unsold</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{item.species}</td>
                      <td className="p-3">{item.registered}</td>
                      <td className="p-3">{item.sold}</td>
                      <td className="p-3">{item.unsold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 mt-4">
              <p className="font-bold text-lg">Income</p>
              <p className="text-sm">Jan 01 - Dec 31</p>
              {/* Placeholder for the chart */}
              <div className="bg-gray-200 h-32 mt-4 flex items-center justify-center">
                <p>Chart Placeholder</p>
              </div>
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                View full report
              </button>
            </div>
          </div>

          {/* Right Side: Livestock Prices */}
          <div className="w-1/2">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-bold">Prevailing average prices as of April 2024</h2>
              <table className="w-full table-auto border-collapse mt-4">
                <thead>
                  <tr className="bg-green-800 text-white text-left">
                    <th className="p-2">Livestock</th>
                    <th className="p-2">Average per Kilo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-2 font-bold">Cattle</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Liveweight</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Estimated Dressed weight</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Fattener</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2 font-bold">Carabao</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Liveweight</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Estimated Dressed weight</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2 font-bold">Horse</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Liveweight</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Estimated Dressed weight</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2 font-bold">Goat</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Liveweight</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2 font-bold">Hog</td>
                    <td className="p-2"></td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Liveweight</td>
                    <td className="p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionReports;

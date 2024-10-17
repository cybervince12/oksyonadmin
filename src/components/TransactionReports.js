import React from 'react';
import TopHeader from './TopHeader'; // Import TopHeader component

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
      <div className="p-6 bg-gray-100 flex-grow">
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Species</th>
                <th className="p-2">Registered</th>
                <th className="p-2">Sold</th>
                <th className="p-2">Unsold</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{item.species}</td>
                  <td className="p-2">{item.registered}</td>
                  <td className="p-2">{item.sold}</td>
                  <td className="p-2">{item.unsold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionReports;

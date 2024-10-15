import React from 'react';

const TransactionReports = () => {
  const reportData = [
    { species: 'Carabao', registered: 507, sold: 507, unsold: 0 },
    { species: 'Cattle', registered: 592, sold: 592, unsold: 0 },
    { species: 'Horse', registered: 31, sold: 31, unsold: 0 },
    { species: 'Goat', registered: 77, sold: 77, unsold: 0 },
    { species: 'Hogs', registered: 0, sold: 0, unsold: 0 },
  ];

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="text-3xl font-bold mb-6">Weekly Animal Transaction Report</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Species</th>
              <th className="p-2">Register</th>
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
  );
};

export default TransactionReports;

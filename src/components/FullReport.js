import React from 'react';
import { useNavigate } from 'react-router-dom';

const FullReport = () => {
  const navigate = useNavigate(); 

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
    <div className="p-6 bg-gray-100 relative"> 
      <h2 className="text-2xl font-bold text-green-800">Full Weekly Report</h2>
      <button
        className="mt-4 mb-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        onClick={() => navigate(-1)} 
      >
        Back
      </button>
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
  );
};

export default FullReport;

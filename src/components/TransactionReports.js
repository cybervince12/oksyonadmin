import React, { useEffect, useState } from 'react';
import TopHeader from './TopHeader';
import { supabase } from '../supabaseClient';

const TransactionReports = () => {
  // State for storing report data from Supabase
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    // Function to fetch data from Supabase
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('livestock') // Access the 'livestock' table
          .select('*'); // Select all columns

        if (error) {
          throw error;
        }

        // Process the fetched data and group by category
        const categorizedData = ['Carabao', 'Cattle', 'Horse', 'Goat', 'Sheep', 'Pig'].map((category) => {
          const filteredData = data.filter(
            (item) => item.category === category && item.status !== 'DISAPPROVED' && item.status !== 'PENDING'
          );

          const registered = filteredData.length;
          const sold = filteredData.filter((item) => item.status === 'SOLD').length;
          const unsold = filteredData.filter((item) => item.status === 'AUCTION_ENDED').length;

          return {
            category,
            registered,
            sold,
            unsold,
          };
        });

        setReportData(categorizedData); // Update state with categorized data
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      }
    };

    fetchData(); // Call the fetchData function on component mount
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Apply TopHeader component */}
      <TopHeader title="Transaction Reports" />

      <div className="p-6 bg-gray-100 flex-grow flex flex-col space-y-4">
        {/* Two-column Layout */}
        <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Left Side: Transaction Summary with Report Header */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-lg rounded-lg p-6">
              {/* Report Header */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Weekly Animal Transaction Report</h1>
                <p className="text-gray-500">
                  For the month of:{" "}
                  <span className="font-bold">
                    {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
                  </span>
                </p>
                <p className="text-gray-500">Number of Livestock in Transactions</p>
              </div>

              {/* Category Table */}
              <h2 className="text-lg font-bold text-gray-800 mt-6">Transaction Summary</h2>
              <table className="w-full table-auto border-collapse mt-4">
                <thead>
                  <tr className="bg-green-800 text-white">
                    <th className="p-3 border">Category</th>
                    <th className="p-3 border">Registered</th>
                    <th className="p-3 border">Sold</th>
                    <th className="p-3 border">Unsold</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3 text-gray-700">{item.category}</td>
                      <td className="p-3 text-gray-700">{item.registered}</td>
                      <td className="p-3 text-gray-700">{item.sold}</td>
                      <td className="p-3 text-gray-700">{item.unsold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side: Livestock Prices */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-800">Prevailing Average Prices of Livestock</h2>
              <table className="w-full table-auto border-collapse mt-4">
                <thead>
                  <tr className="bg-green-800 text-white">
                    <th className="p-3">Livestock</th>
                    <th className="p-3">Average Price (₱ per Kilo)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3 text-gray-700">Cattle</td>
                    <td className="p-3 text-gray-700">174.58</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 text-gray-700">Carabao</td>
                    <td className="p-3 text-gray-700">149.41</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 text-gray-700">Horse</td>
                    <td className="p-3 text-gray-700">500</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 text-gray-700">Goat</td>
                    <td className="p-3 text-gray-700">230.65</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 text-gray-700">Sheep</td>
                    <td className="p-3 text-gray-700">54</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3 text-gray-700">Pig</td>
                    <td className="p-3 text-gray-700">169.73</td>
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

import React, { useState } from 'react';

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const transactions = [
    { auctionId: '001', title: 'Cattle Sale', status: 'To review', shippingPermit: 'Upcoming' },
    { auctionId: '002', title: 'Cattle Sale', status: 'Posted', shippingPermit: 'Upcoming' },
    { auctionId: '003', title: 'Sheep Sale', status: 'Posted', shippingPermit: 'Upcoming' },
  ];

  const renderTransactions = () => {
    return transactions.map((transaction, index) => (
      <tr key={index} className="border-t">
        <td className="p-2">{transaction.auctionId}</td>
        <td className="p-2">{transaction.title}</td>
        <td className="p-2">{transaction.status}</td>
        <td className="p-2">
          <button className="text-blue-500 hover:text-blue-700">Edit</button> |{' '}
          <button className="text-red-500 hover:text-red-700">Delete</button>
        </td>
        <td className="p-2">
          <span className={`py-1 px-3 rounded ${transaction.shippingPermit === 'Upcoming' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>
            {transaction.shippingPermit}
          </span>
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-6 bg-gray-100 h-screen">
      <h1 className="text-3xl font-bold mb-6">Transaction</h1>

      {/* Tab Navigation */}
      <div className="border-b mb-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 ${activeTab === 'pending' ? 'border-b-2 border-green-500 font-bold' : ''}`}
        >
          Pending Transaction
        </button>
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`px-4 py-2 ${activeTab === 'ongoing' ? 'border-b-2 border-green-500 font-bold' : ''}`}
        >
          Ongoing Transaction
        </button>
        <button
          onClick={() => setActiveTab('finished')}
          className={`px-4 py-2 ${activeTab === 'finished' ? 'border-b-2 border-green-500 font-bold' : ''}`}
        >
          Finish Transaction
        </button>
      </div>

      {/* Transaction Table */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2">Auction ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
              <th className="p-2">Shipping Permit</th>
            </tr>
          </thead>
          <tbody>{renderTransactions()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;

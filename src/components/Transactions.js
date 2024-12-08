import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TopHeader from './TopHeader';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        let statusFilterQuery = [];
        if (activeTab === 'Pending') {
          statusFilter = ['PENDING'];
        } else if (activeTab === 'Ongoing') {
          statusFilter = ['AVAILABLE'];
        } else if (activeTab === 'Finished') {
          statusFilterQuery = ['AUCTION_ENDED', 'SOLD'];
        }

        const { data, error } = await supabase
          .from('livestock')
          .select('*')
          .in('status', statusFilterQuery);

        if (error) {
          console.error('Error fetching livestock:', error);
        } else {
          setTransactions(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchTransactions();
  }, [activeTab]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.livestock_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || transaction.category === categoryFilter;
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(transaction.status);

    const auctionStart = new Date(transaction.auction_start);
    const matchesDateRange =
      (!startDate || auctionStart >= new Date(startDate)) &&
      (!endDate || auctionStart <= new Date(endDate));

    return matchesSearch && matchesCategory && matchesStatus && matchesDateRange;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const fieldA = a.auction_start;
    const fieldB = b.auction_start;

    if (sortOrder === 'asc') {
      return new Date(fieldA) - new Date(fieldB);
    } else {
      return new Date(fieldB) - new Date(fieldA);
    }
  });

  const currentTransactions = sortedTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const handleApproveDisapprove = async (id, currentStatus) => {
    let newStatus;
  
    if (currentStatus === 'AVAILABLE') {
      newStatus = 'AUCTION_ONGOING'; // Moves to Ongoing
    } else if (currentStatus === 'PENDING') {
      newStatus = 'AVAILABLE'; // Back to Available
    } else {
      return; // Exit for unsupported status transitions
    }
  
    try {
      const { error } = await supabase
        .from('livestock')
        .update({ status: newStatus })
        .eq('livestock_id', id);
  
      if (error) {
        console.error('Error updating livestock status:', error);
      } else {
        setTransactions(
          transactions.map((transaction) =>
            transaction.livestock_id === id ? { ...transaction, status: newStatus } : transaction
          )
        );
      }
    } catch (error) {
      console.error('Unexpected error during approval/disapproval:', error);
    }
  };
  
  const renderTransactions = () => {
    if (currentTransactions.length === 0) {
      return <p>No transactions available.</p>;
    }

    return currentTransactions.map((transaction, index) => (
      <tr
        key={index}
        className={`border-t hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
      >
        <td className="p-3 text-sm">{transaction.livestock_id}</td>
        <td className="p-3 text-sm">{transaction.category}</td>
        <td className="p-3 text-sm">{transaction.breed}</td>
        <td className="p-3 text-sm">{transaction.age}</td>
        <td className="p-3 text-sm">{transaction.gender}</td>
        <td className="p-3 text-sm">{transaction.weight}</td>
        <td className="p-3 text-sm">{transaction.starting_price}</td>
        <td className="p-3 text-sm">{format(new Date(transaction.auction_start), 'MM/dd/yyyy hh:mm a')}</td>
        <td className="p-3 text-sm">{format(new Date(transaction.auction_end), 'MM/dd/yyyy hh:mm a')}</td>
        <td className="p-3 text-sm">
          <span
            className={`py-1 px-3 rounded text-sm ${
              transaction.status === 'AVAILABLE'
                ? 'bg-green-500 text-white'
                : transaction.status === 'PENDING'
                ? 'bg-yellow-500 text-white'
                : transaction.status === 'AUCTION_ENDED'
                ? 'bg-red-500 text-white'
                : 'bg-gray-500 text-white'
            }`}
          >
            {transaction.status}
          </span>
        </td>
        <td className="p-3 text-sm">{transaction.location}</td>
        <td className="p-3 text-sm">
          {transaction.proof_of_ownership_url ? (
            <a href={transaction.proof_of_ownership_url} target="_blank" rel="noopener noreferrer">Proof</a>
          ) : (
            'Not Available'
          )}
        </td>
        <td className="p-3 text-sm">
          {transaction.vet_certificate_url ? (
            <a href={transaction.vet_certificate_url} target="_blank" rel="noopener noreferrer">Vet Cert</a>
          ) : (
            'Not Available'
          )}
        </td>
        <td className="p-3 text-sm">
          {activeTab !== 'Finished' && (
            <button
            onClick={() => handleApproveDisapprove(transaction.livestock_id, transaction.status)}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600`}
          >
            {transaction.status === 'AVAILABLE' ? 'Approve' : 'Disapprove'}
          </button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
  <TopHeader title="Transactions" />
  <div className="p-6 bg-white shadow-md rounded-lg flex-grow">
    <div className="flex flex-wrap mb-4 border-b border-gray-300">
      <button
        onClick={() => setActiveTab('Pending')}
        className={`px-4 py-2 ${activeTab === 'Pending' ? 'border-b-2 border-yellow-600 font-semibold text-yellow-600' : 'text-gray-500'} rounded-md`}
      >
        Pending Transaction
      </button>
      <button
        onClick={() => setActiveTab('Ongoing')}
        className={`px-4 py-2 ${activeTab === 'Ongoing' ? 'border-b-2 border-green-600 font-semibold text-green-600' : 'text-gray-500'} rounded-md`}
      >
        Ongoing Transaction
      </button>
      <button
        onClick={() => setActiveTab('Finished')}
        className={`px-4 py-2 ${activeTab === 'Finished' ? 'border-b-2 border-red-600 font-semibold text-red-600' : 'text-gray-500'} rounded-md`}
      >
        Finished Transaction
      </button>
    </div>

    <div className="flex flex-wrap mb-4 space-x-4">
  {/* Filters Section */}
  <div className="flex space-x-4">
    <input
      type="text"
      className="border border-gray-300 rounded-lg p-1 w-40"
      placeholder="Search by ID or Category"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <select
      value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}
      className="border border-gray-300 rounded-lg p-1 w-32"
    >
      <option value="">All Categories</option>
      <option value="Cattle">Cattle</option>
      <option value="Sheep">Sheep</option>
      <option value="Carabao">Carabao</option>
      <option value="Horse">Horse</option>
      <option value="Pig">Pig</option>
      <option value="Goat">Goat</option>
    </select>
  
    <input
      type="date"
      className="border border-gray-300 rounded-lg p-1 w-32"
      onChange={(e) => setStartDate(e.target.value)}
      value={startDate}
    />
    <input
      type="date"
      className="border border-gray-300 rounded-lg p-1 w-32"
      onChange={(e) => setEndDate(e.target.value)}
      value={endDate}
    />
  </div>

  {/* Action Buttons */}
  <div className="flex space-x-2 mt-4">
    <button
      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
    >
      Sort by Date {sortOrder === 'asc' ? '▲' : '▼'}
    </button>
    <CSVLink data={transactions} filename="transactions.csv">
      <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition">
        Export to CSV
      </button>
    </CSVLink>
  </div>
</div>

    {/* Transactions Table */}
    <table className="table-auto w-full border-collapse mt-4">
      <thead className="bg-green-800 text-white">
        <tr>
          <th className="p-3 text-left">ID</th>
          <th className="p-3 text-left">Category</th>
          <th className="p-3 text-left">Breed</th>
          <th className="p-3 text-left">Age</th>
          <th className="p-3 text-left">Gender</th>
          <th className="p-3 text-left">Weight</th>
          <th className="p-3 text-left">Starting Price</th>
          <th className="p-3 text-left">Auction Start</th>
          <th className="p-3 text-left">Auction End</th>
          <th className="p-3 text-left">Status</th>
          <th className="p-3 text-left">Location</th>
          <th className="p-3 text-left">Proof of Ownership</th>
          <th className="p-3 text-left">Vet Certificate</th>
          <th className="p-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>{renderTransactions()}</tbody>
    </table>

    {/* Pagination */}
    <div className="flex justify-between mt-4">
      <button
        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
        className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-400 text-white"
      >
        Prev
      </button>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-400 text-white"
      >
        Next
      </button>
    </div>
  </div>
</div>

  );
};

export default Transactions;

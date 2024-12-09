import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TopHeader from './TopHeader';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        let statusFilter;
        if (activeTab === 'Pending') {
          statusFilter = ['PENDING'];
        } else if (activeTab === 'Ongoing') {
          statusFilter = ['AVAILABLE'];
        } else if (activeTab === 'Finished') {
          statusFilter = ['AUCTION_ENDED', 'SOLD'];
        }

        let query = supabase.from('livestock').select('*').in('status', statusFilter);

        if (categoryFilter) {
          query = query.eq('category', categoryFilter);
        }

        if (startDate) {
          query = query.gte('auction_start', startDate);
        }
        if (endDate) {
          query = query.lte('auction_end', endDate);
        }

        const { data, error } = await query;
        if (error) {
          console.error('Error fetching livestock:', error);
          setErrorMessage('Failed to fetch livestock. Please try again later.');
        } else {
         
          let filteredData = data.filter((transaction) =>
            transaction.livestock_id.includes(searchQuery) ||
            transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
          );

          filteredData.sort((a, b) => {
            const dateA = new Date(a.auction_start);
            const dateB = new Date(b.auction_start);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
          });

          setTransactions(filteredData);
          setErrorMessage(null);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setErrorMessage('An unexpected error occurred while fetching livestock.');
      }
    };

    fetchTransactions();
  }, [activeTab, searchQuery, categoryFilter, startDate, endDate, sortOrder]);

  const handleApprove = async (id) => {
    try {
      const { error } = await supabase
        .from('livestock')
        .update({ status: 'AVAILABLE' })
        .eq('livestock_id', id);
  
      if (error) {
        console.error('Error approving livestock:', error);
        setErrorMessage('Failed to approve livestock. Please try again.');
      } else {
        setTransactions(
          transactions.map((transaction) =>
            transaction.livestock_id === id ? { ...transaction, status: 'AVAILABLE' } : transaction
          )
        );
      }
    } catch (error) {
      console.error('Unexpected error during approval:', error);
      setErrorMessage('An unexpected error occurred while approving livestock.');
    }
  };
  
  const handleDisapprove = async (id) => {
    try {
      const { error } = await supabase
        .from('livestock')
        .update({ status: 'Disapprove' }) 
        .eq('livestock_id', id);
  
      if (error) {
        console.error('Error disapproving livestock:', error);
        setErrorMessage('Failed to disapprove livestock. Please try again.');
      } else {
       
        setTransactions(
          transactions.map((transaction) =>
            transaction.livestock_id === id ? { ...transaction, status: 'Disapprove' } : transaction
          )
        );
      }
    } catch (error) {
      console.error('Unexpected error during disapproval:', error);
      setErrorMessage('An unexpected error occurred while disapproving livestock.');
    }
  };
  
  
  const renderTransactions = () => {
    const startIndex = (currentPage - 1) * pageLimit;
    const paginatedData = transactions.slice(startIndex, startIndex + pageLimit);

    if (paginatedData.length === 0) {
      return <p>No transactions available for this tab.</p>;
    }

    return paginatedData.map((transaction, index) => (
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
        <td className="p-3 text-sm">{transaction.current_bid}</td>
        <td className="p-3 text-sm">
          {format(new Date(transaction.auction_start), 'MM/dd/yyyy hh:mm a')}
        </td>
        <td className="p-3 text-sm">
          {format(new Date(transaction.auction_end), 'MM/dd/yyyy hh:mm a')}
        </td>
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
            <a href={transaction.proof_of_ownership_url} target="_blank" rel="noopener noreferrer">
              Proof
            </a>
          ) : (
            'Not Available'
          )}
        </td>
        <td className="p-3 text-sm">
          {transaction.vet_certificate_url ? (
            <a href={transaction.vet_certificate_url} target="_blank" rel="noopener noreferrer">
              Vet Cert
            </a>
          ) : (
            'Not Available'
          )}
        </td>
        <td className="p-3 text-sm">
        <div className="flex space-x-2">
          <button
            onClick={() => handleApprove(transaction.livestock_id)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={() => handleDisapprove(transaction.livestock_id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Disapprove
          </button>
        </div>
      </td>
      </tr>
    ));
  };

  // Calculate total pages
  const totalPages = Math.ceil(transactions.length / pageLimit);

  return (
    <div className="h-screen flex flex-col">
      <TopHeader title="Transactions" />
      <div className="p-6 bg-gray-100 flex-grow">
        <div className="flex mb-4 border-b">
          <button
            onClick={() => setActiveTab('Pending')}
            className={`px-4 py-2 ${activeTab === 'Pending' ? 'border-b-2 border-yellow-500 font-bold' : ''}`}
          >
            Pending Transaction
          </button>
          <button
            onClick={() => setActiveTab('Ongoing')}
            className={`px-4 py-2 ${activeTab === 'Ongoing' ? 'border-b-2 border-green-500 font-bold' : ''}`}
          >
            Ongoing Transaction
          </button>
          <button
            onClick={() => setActiveTab('Finished')}
            className={`px-4 py-2 ${activeTab === 'Finished' ? 'border-b-2 border-red-500 font-bold' : ''}`}
          >
            Finished Transaction
          </button>
        </div>
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        <div className="flex space-x-4 mb-4">
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
            <option value="Pig">Pig</option>
            <option value="Goat">Goat</option>
            <option value="Carabao">Carabao</option>
            <option value="Horse">Horse</option>
            <option value="Sheep">Sheep</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-1 w-40"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-1 w-40"
          />
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
          </button>
          <CSVLink
            data={transactions}
            filename="transactions.csv"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Export to CSV
          </CSVLink>
        </div>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-green-800 text-white">
              <th className="p-3 text-sm text-left">Livestock ID</th>
              <th className="p-3 text-sm text-left">Category</th>
              <th className="p-3 text-sm text-left">Breed</th>
              <th className="p-3 text-sm text-left">Age</th>
              <th className="p-3 text-sm text-left">Gender</th>
              <th className="p-3 text-sm text-left">Weight</th>
              <th className="p-3 text-sm text-left">Starting Price</th>
              <th className="p-3 text-sm text-left">Current Bid</th>
              <th className="p-3 text-sm text-left">Auction Start</th>
              <th className="p-3 text-sm text-left">Auction End</th>
              <th className="p-3 text-sm text-left">Status</th>
              <th className="p-3 text-sm text-left">Location</th>
              <th className="p-3 text-sm text-left">Proof of Ownership</th>
              <th className="p-3 text-sm text-left">Vet Certificate</th>
              <th className="p-3 text-sm text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderTransactions()}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;

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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('livestock')
          .select('category')
          .distinct();
        if (error) {
          console.error('Error fetching categories:', error);
        } else {
          setCategories(data.map((item) => item.category));
        }
      } catch (error) {
        console.error('Unexpected error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

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
        } else if (activeTab === 'Disapproved') {
          statusFilter = ['DISAPPROVED'];
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
        .update({ status: 'DISAPPROVED' })
        .eq('livestock_id', id);

      if (error) {
        console.error('Error disapproving livestock:', error);
        setErrorMessage('Failed to disapprove livestock. Please try again.');
      } else {
        setTransactions(
          transactions.map((transaction) =>
            transaction.livestock_id === id ? { ...transaction, status: 'DISAPPROVED' } : transaction
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
                : transaction.status === 'DISAPPROVED'
                ? 'bg-gray-500 text-white'
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
        {activeTab === 'Pending' && (
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
        )}
      </tr>
    ));
  };

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
            Pending Auctions
          </button>
          <button
            onClick={() => setActiveTab('Ongoing')}
            className={`px-4 py-2 ${activeTab === 'Ongoing' ? 'border-b-2 border-green-500 font-bold' : ''}`}
          >
            Ongoing Auctions
          </button>
          <button
            onClick={() => setActiveTab('Finished')}
            className={`px-4 py-2 ${activeTab === 'Finished' ? 'border-b-2 border-red-500 font-bold' : ''}`}
          >
            Finished Auctions
          </button>
          <button
            onClick={() => setActiveTab('Disapproved')}
            className={`px-4 py-2 ${activeTab === 'Disapproved' ? 'border-b-2 border-gray-500 font-bold' : ''}`}
          >
            Disapproved Auctions
          </button>
        </div>

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 mr-2"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border p-2 mr-2"
          >
            <option value="">All Categories</option>
            {/* Static category options */}
            <option value="Cattle">Cattle</option>
            <option value="Goat">Goat</option>
            <option value="Pig">Pig</option>
            <option value="Sheep">Sheep</option>
            <option value="Sheep">Horse</option>
            <option value="Sheep">Carabao</option>
      
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 mr-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2"
          />
        </div>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <table className="w-full table-auto">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Category</th>
              <th className="p-3">Breed</th>
              <th className="p-3">Age</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Weight</th>
              <th className="p-3">Starting Price</th>
              <th className="p-3">Current Bid</th>
              <th className="p-3">Start Date</th>
              <th className="p-3">End Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Location</th>
              <th className="p-3">Ownership Proof</th>
              <th className="p-3">Vet Cert</th>
              {activeTab === 'Pending' && <th className="p-3">Actions</th>}
            </tr>
          </thead>
          <tbody>{renderTransactions()}</tbody>
        </table>

        <div className="mt-4 flex justify-between">
          <div>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Previous
            </button>
            <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          </div>
          <CSVLink data={transactions} filename="transactions.csv" className="px-4 py-2 bg-green-500 text-white rounded">
            Export to CSV
          </CSVLink>
        </div>
      </div>
    </div>
  );
};

export default Transactions;

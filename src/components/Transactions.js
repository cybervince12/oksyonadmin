import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TopHeader from './TopHeader';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [errorMessage, setErrorMessage] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 10;
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const [selectedTransaction, setSelectedTransaction] = useState(null); 

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
          // Removed the filtering based on searchQuery
          data.sort((a, b) => {
            const dateA = new Date(a.auction_start);
            const dateB = new Date(b.auction_start);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
          });
  
          setTransactions(data);
          setErrorMessage(null);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setErrorMessage('An unexpected error occurred while fetching livestock.');
      }
    };

    fetchTransactions();
  }, [activeTab, categoryFilter, startDate, endDate, sortOrder]);

  const handleApprove = async (id) => {
    setSelectedTransaction({ id, action: 'approve' });
    setShowConfirmModal(true);
  };

  const handleDisapprove = async (id) => {
    setSelectedTransaction({ id, action: 'disapprove' });
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    try {
      const updatedStatus = selectedTransaction.action === 'approve' ? 'AVAILABLE' : 'DISAPPROVED';
      const { error } = await supabase
        .from('livestock')
        .update({ status: updatedStatus })
        .eq('livestock_id', selectedTransaction.id);

      if (error) {
        console.error('Error updating livestock:', error);
        setErrorMessage('Failed to update livestock. Please try again.');
      } else {
        setTransactions(
          transactions.map((transaction) =>
            transaction.livestock_id === selectedTransaction.id
              ? { ...transaction, status: updatedStatus }
              : transaction
          )
        );
        setShowConfirmModal(false);
        setSelectedTransaction(null);
      }
    } catch (error) {
      console.error('Unexpected error during approval/disapproval:', error);
      setErrorMessage('An unexpected error occurred while updating livestock.');
    }
  };

  const cancelAction = () => {
    setShowConfirmModal(false);
    setSelectedTransaction(null);
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
        <td className="p-3 text-sm">{index + 1}</td>
        <td className="p-3 text-sm">{transaction.livestock_id}</td>
        <td className="p-3 text-sm">{transaction.category}</td>
        <td className="p-3 text-sm">{transaction.breed}</td>
        <td className="p-3 text-sm">{transaction.age}</td>
        <td className="p-3 text-sm">{transaction.gender}</td>
        <td className="p-3 text-sm">{transaction.weight}kg</td>
        <td className="p-3 text-sm">P{transaction.starting_price}</td>
        <td className="p-3 text-sm">{transaction.current_bid}</td>
        <td className="p-3 text-sm">
          {format(new Date(transaction.auction_start), 'MM/dd/yyyy hh:mm a')}
        </td>
        <td className="p-3 text-sm">
          {format(new Date(transaction.auction_end), 'MM/dd/yyyy hh:mm a')}
        </td>
        <td className="p-3 text-sm">
        <span
  className={`py-2 px-4 rounded text-sm font-semibold inline-flex items-center ${
    transaction.status === 'AVAILABLE'
      ? 'bg-green-600 text-white'
      : transaction.status === 'PENDING'
      ? 'bg-yellow-600 text-white'
      : transaction.status === 'AUCTION_ENDED'
      ? 'bg-red-600 text-white'
      : transaction.status === 'DISAPPROVED'
      ? 'bg-gray-600 text-white'
      : 'bg-gray-400 text-white'
  }`}
>
  {transaction.status === 'AVAILABLE' && (
    <svg
      className="w-4 h-4 mr-2 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )}
  {transaction.status === 'PENDING' && (
    <svg
      className="w-4 h-4 mr-2 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 5v14m7-7H5"
      />
    </svg>
  )}
  {transaction.status === 'AUCTION_ENDED' && (
    <svg
      className="w-4 h-4 mr-2 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 9l6 6 6-6"
      />
    </svg>
  )}
  {transaction.status === 'DISAPPROVED' && (
    <svg
      className="w-4 h-4 mr-2 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )}
  {transaction.status}
</span>

        </td>
        <td className="p-3 text-sm">{transaction.location}</td>
        <td className="p-3 text-sm">
  {transaction.proof_of_ownership_url ? (
    <span
      onClick={() => window.open(transaction.proof_of_ownership_url, '_blank')}
      className="text-blue-500 underline cursor-pointer hover:text-blue-600"
    >
      View Proof of Ownership
    </span>
  ) : (
    'Not Available'
  )}
</td>
<td className="p-3 text-sm">
  {transaction.vet_certificate_url ? (
    <span
      onClick={() => window.open(transaction.vet_certificate_url, '_blank')}
      className="text-blue-500 underline cursor-pointer hover:text-blue-600"
    >
      View Vet Certificate
    </span>
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

  return (
    <>
      <TopHeader title="Transaction Reports" />
      <div className="container mx-auto p-4">
        {errorMessage && (
          <div className="text-red-500 text-center p-2 border border-red-500 mb-4">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 border-b-4 rounded-sm ${
              activeTab === 'Pending' ? 'text-yellow-600 border-yellow-600' : 'border-transparent'
            }`}
            onClick={() => setActiveTab('Pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 border-b-4 rounded-sm ${
              activeTab === 'Ongoing' ? 'text-green-600 border-green-600' : 'border-transparent'
            }`}
            onClick={() => setActiveTab('Ongoing')}
          >
            Ongoing
          </button>
          <button
            className={`px-4 py-2 border-b-4 rounded-sm ${
              activeTab === 'Finished' ? 'text-red-600 border-red-600' : 'border-transparent'
            }`}
            onClick={() => setActiveTab('Finished')}
          >
            Finished
          </button>
          <button
            className={`px-4 py-2 border-b-4 rounded-sm ${
              activeTab === 'Disapproved' ? 'text-gray-700 border-gray-500' : 'border-transparent'
            }`}
            onClick={() => setActiveTab('Disapproved')}
          >
            Disapproved
          </button>
        </div>


          <CSVLink
            data={transactions}
            filename="transactions.csv"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Export CSV
          </CSVLink>
        </div>

        <div className="mb-4 flex justify-between">
            <div className="flex space-x-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        >
          <option value="" >Filter by Category</option>
          <option value="sheep">Sheep</option>
          <option value="pig">Pig</option>
          <option value="carabao">Carabao</option>
          <option value="cattle">Cattle</option>
          <option value="goat">Goat</option>
          <option value="horse">Horse</option>
    </select>

    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="px-4 py-2 border rounded"
    />
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="px-4 py-2 border rounded"
    />
  </div>
        </div>

        <table className="w-full border-collapse text-xs max-w-screen-sm overflow-auto">
  <thead>
    <tr>
      <th className="p-1 text-xs text-white bg-green-800">#</th>
      <th className="p-1 text-xs text-white bg-green-800">ID</th>
      <th className="p-1 text-xs text-white bg-green-800">Category</th>
      <th className="p-1 text-xs text-white bg-green-800">Breed</th>
      <th className="p-1 text-xs text-white bg-green-800">Age</th>
      <th className="p-1 text-xs text-white bg-green-800">Gender</th>
      <th className="p-1 text-xs text-white bg-green-800">Weight</th>
      <th className="p-1 text-xs text-white bg-green-800">Starting Price</th>
      <th className="p-1 text-xs text-white bg-green-800">Current Bid</th>
      <th className="p-1 text-xs text-white bg-green-800">Auction Start</th>
      <th className="p-1 text-xs text-white bg-green-800">Auction End</th>
      <th className="p-1 text-xs text-white bg-green-800">Status</th>
      <th className="p-1 text-xs text-white bg-green-800">Location</th>
      <th className="p-1 text-xs text-white bg-green-800">Proof of Ownership</th>
      <th className="p-1 text-xs text-white bg-green-800">Vet Cert</th>
      {activeTab === 'Pending' && <th className="p-1 text-xs text-white bg-green-800">Actions</th>}
    </tr>
  </thead>
  <tbody>{renderTransactions()}</tbody>
</table>


{showConfirmModal && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg relative">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Action</h2>
      <p className="text-gray-600 text-sm mb-6">
        Are you sure you want to <span className="font-medium text-gray-800">{selectedTransaction?.action}</span> this transaction?
      </p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={cancelAction}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={confirmAction}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={(currentPage * pageLimit) >= transactions.length}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Transactions;

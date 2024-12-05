import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TopHeader from './TopHeader';
import { format } from 'date-fns';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        let statusFilter;
        if (activeTab === 'Pending') {
          statusFilter = ['AVAILABLE', 'PENDING'];
        } else if (activeTab === 'Ongoing') {
          statusFilter = ['AUCTION_ONGOING'];
        } else if (activeTab === 'Finished') {
          statusFilter = ['AUCTION_ENDED', 'SOLD'];
        }

        const { data, error } = await supabase
          .from('livestock')
          .select('*')
          .in('status', statusFilter);

        if (error) {
          console.error('Error fetching livestock:', error);
          setErrorMessage('Failed to fetch livestock. Please try again later.');
        } else {
          setTransactions(data);
          setErrorMessage(null);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setErrorMessage('An unexpected error occurred while fetching livestock.');
      }
    };

    fetchTransactions();
  }, [activeTab]);

  const handleApproveDisapprove = async (id, currentStatus) => {
    const newStatus = currentStatus === 'AVAILABLE' ? 'PENDING' : 'AVAILABLE';
    try {
      const { error } = await supabase
        .from('livestock')
        .update({ status: newStatus })
        .eq('livestock_id', id);

      if (error) {
        console.error('Error updating livestock status:', error);
        setErrorMessage('Failed to update livestock status. Please try again.');
      } else {
        setTransactions(
          transactions.map((transaction) =>
            transaction.livestock_id === id ? { ...transaction, status: newStatus } : transaction
          )
        );
      }
    } catch (error) {
      console.error('Unexpected error during approval/disapproval:', error);
      setErrorMessage('An unexpected error occurred while updating livestock status.');
    }
  };

  const renderTransactions = () => {
    if (transactions.length === 0) {
      return <p>No transactions available for this tab.</p>;
    }

    return transactions.map((transaction, index) => (
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
          <button
            onClick={() => handleApproveDisapprove(transaction.livestock_id, transaction.status)}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600`}
          >
            {transaction.status === 'AVAILABLE' ? 'Disapprove' : 'Approve'}
          </button>
        </td>
      </tr>
    ));
  };

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
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-separate border-spacing-0.5">
            <thead>
              <tr className="text-left text-white bg-green-800 text-sm font-semibold">
                <th className="p-3">Auction ID</th>
                <th className="p-3">Category</th>
                <th className="p-3">Breed</th>
                <th className="p-3">Age</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Weight</th>
                <th className="p-3">Starting Price</th>
                <th className="p-3">Current Bid</th>
                <th className="p-3">Auction Start</th>
                <th className="p-3">Auction End</th>
                <th className="p-3">Status</th>
                <th className="p-3">Location</th>
                <th className="p-3">Proof of Ownership</th>
                <th className="p-3">Vet Certificate</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>{renderTransactions()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;

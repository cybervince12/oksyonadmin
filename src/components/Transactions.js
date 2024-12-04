import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TopHeader from './TopHeader';
import { format } from 'date-fns'; // for date formatting

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        let statusFilter;
        if (activeTab === 'active') {
          statusFilter = ['AVAILABLE', 'PENDING'];
        } else if (activeTab === 'ended') {
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
          setErrorMessage(null); // Clear any previous errors
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
        .eq('livestock_id', id);  // Corrected to livestock_id

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
      <tr key={index} className="border-t">
        <td className="p-2">{transaction.livestock_id}</td>
        <td className="p-2">{transaction.owner_id}</td>
        <td className="p-2">{transaction.category}</td>
        <td className="p-2">{transaction.gender}</td>
        <td className="p-2">
          {transaction.image_url ? (
            <img src={transaction.image_url} alt="Livestock" className="w-12 h-12 object-cover" />
          ) : (
            'No Image'
          )}
        </td>
        <td className="p-2">
          {transaction.proof_of_ownership_url ? (
            <a href={transaction.proof_of_ownership_url} target="_blank" rel="noopener noreferrer">Proof</a>
          ) : (
            'Not Available'
          )}
        </td>
        <td className="p-2">
          {transaction.vet_certificate_url ? (
            <a href={transaction.vet_certificate_url} target="_blank" rel="noopener noreferrer">Vet Cert</a>
          ) : (
            'Not Available'
          )}
        </td>
        <td className="p-2">{transaction.breed}</td>
        <td className="p-2">{transaction.age}</td>
        <td className="p-2">{transaction.weight}</td>
        <td className="p-2">{transaction.starting_price}</td>
        <td className="p-2">{transaction.location}</td>
        <td className="p-2">{format(new Date(transaction.auction_start), 'MM/dd/yyyy hh:mm a')}</td>
        <td className="p-2">{format(new Date(transaction.auction_end), 'MM/dd/yyyy hh:mm a')}</td>
        <td className="p-2">
          <span
            className={`py-1 px-3 rounded ${transaction.status === 'AVAILABLE' || transaction.status === 'PENDING' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
          >
            {transaction.status}
          </span>
        </td>
        <td className="p-2">
          <button
            onClick={() => handleApproveDisapprove(transaction.livestock_id, transaction.status)} // Corrected to livestock_id
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
        <div className="border-b mb-4">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 ${activeTab === 'active' ? 'border-b-2 border-green-500 font-bold' : ''}`}
          >
            Active Transaction
          </button>
          <button
            onClick={() => setActiveTab('ended')}
            className={`px-4 py-2 ${activeTab === 'ended' ? 'border-b-2 border-green-500 font-bold' : ''}`}
          >
            Ended Transaction
          </button>
        </div>
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Owner ID</th>
              <th className="p-2">Category</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Image</th>
              <th className="p-2">Proof of Ownership</th>
              <th className="p-2">Vet Certificate</th>
              <th className="p-2">Breed</th>
              <th className="p-2">Age</th>
              <th className="p-2">Weight</th>
              <th className="p-2">Starting Price</th>
              <th className="p-2">Location</th>
              <th className="p-2">Auction Start</th>
              <th className="p-2">Auction End</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>{renderTransactions()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;


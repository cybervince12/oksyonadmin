import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TopHeader from './TopHeader';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]); // still named 'transactions' for UI consistency
  const [activeTab, setActiveTab] = useState('active');  // Set default active tab to 'active'
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch livestock data from Supabase with a filter for active items
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        let statusFilter;
        // Set status filter based on the active tab
        if (activeTab === 'active') {
          statusFilter = ['AVAILABLE', 'PENDING'];
        } else if (activeTab === 'ended') {
          statusFilter = ['AUCTION_ENDED', 'SOLD'];
        }

        // Fetch livestock data from the livestock table
        const { data, error } = await supabase
          .from('livestock')
          .select('*') // Fetch all columns
          .in('status', statusFilter); // Filter by selected statuses

        if (error) {
          console.error('Error fetching livestock:', error);
          setErrorMessage('Failed to fetch livestock. Please try again later.');
        } else {
          setTransactions(data); // Store fetched livestock data
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setErrorMessage('An unexpected error occurred while fetching livestock.');
      }
    };

    fetchTransactions();
  }, [activeTab]); // Re-fetch when the activeTab changes

  // Delete a livestock item by ID
  const handleDelete = async (id) => {
    const { error } = await supabase.from('livestock').delete().eq('id', id);
    if (error) {
      console.error('Error deleting livestock:', error);
      setErrorMessage('Failed to delete livestock. Please try again.');
    } else {
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
    }
  };

  // Edit a livestock item's status
  const handleEdit = async (id, currentStatus) => {
    const newStatus = prompt('Enter new status:', currentStatus);
    if (newStatus && newStatus !== currentStatus) {
      const { error } = await supabase
        .from('livestock')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) {
        console.error('Error updating livestock:', error);
        setErrorMessage('Failed to update livestock. Please try again.');
      } else {
        setTransactions(
          transactions.map((transaction) =>
            transaction.id === id ? { ...transaction, status: newStatus } : transaction
          )
        );
      }
    }
  };

  // Approve a livestock item by ID
  const handleApprove = async (id) => {
    const { error } = await supabase
      .from('livestock')
      .update({ status: 'APPROVED' })
      .eq('id', id);

    if (error) {
      console.error('Error approving livestock:', error);
      setErrorMessage('Failed to approve livestock. Please try again.');
    } else {
      setTransactions(
        transactions.map((transaction) =>
          transaction.id === id ? { ...transaction, status: 'APPROVED' } : transaction
        )
      );
    }
  };

  // Render filtered livestock transactions based on the active tab
  const renderTransactions = () => {
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
        <td className="p-2">{transaction.auction_start}</td>
        <td className="p-2">{transaction.auction_end}</td>
        <td className="p-2">
          <button
            onClick={() => handleEdit(transaction.id, transaction.status)}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>{' '}
          |{' '}
          <button
            onClick={() => handleDelete(transaction.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </td>
        <td className="p-2">
          <span
            className={`py-1 px-3 rounded ${transaction.status === 'AVAILABLE' || transaction.status === 'PENDING' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
          >
            {transaction.status}
          </span>
        </td>
        <td className="p-2">
          <button
            onClick={() => handleApprove(transaction.id)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Approve
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
        <div className="bg-white shadow-md rounded-lg p-4">
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <div className="overflow-x-auto block sm:overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left bg-green-800 text-white">
                  <th className="p-2">Livestock ID</th>
                  <th className="p-2">Owner ID</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Gender</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Ownership Proof</th>
                  <th className="p-2">Vet Certificate</th>
                  <th className="p-2">Breed</th>
                  <th className="p-2">Age</th>
                  <th className="p-2">Weight</th>
                  <th className="p-2">Starting Price</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Auction Start</th>
                  <th className="p-2">Auction End</th>
                  <th className="p-2">Actions</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Approve</th>
                </tr>
              </thead>
              <tbody>{renderTransactions()}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;

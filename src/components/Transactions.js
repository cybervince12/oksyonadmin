import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import TopHeader from './TopHeader';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch transactions from Supabase
  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase.from('transactions').select('*');
      if (error) {
        console.error('Error fetching transactions:', error);
        setErrorMessage('Failed to fetch transactions. Please try again later.');
      } else {
        setTransactions(data);
      }
    };
    fetchTransactions();
  }, []);

  // Delete a transaction by ID
  const handleDelete = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      console.error('Error deleting transaction:', error);
      setErrorMessage('Failed to delete transaction. Please try again.');
    } else {
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
    }
  };

  // Edit a transaction's status
  const handleEdit = async (id, currentStatus) => {
    const newStatus = prompt('Enter new status:', currentStatus);
    if (newStatus && newStatus !== currentStatus) {
      const { error } = await supabase
        .from('transactions')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) {
        console.error('Error updating transaction:', error);
        setErrorMessage('Failed to update transaction. Please try again.');
      } else {
        setTransactions(
          transactions.map((transaction) =>
            transaction.id === id ? { ...transaction, status: newStatus } : transaction
          )
        );
      }
    }
  };

  // Render filtered transactions based on the active tab
  const renderTransactions = () => {
    const filteredTransactions = transactions.filter(
      (transaction) => transaction.status === activeTab
    );

    return filteredTransactions.map((transaction, index) => (
      <tr key={index} className="border-t">
        <td className="p-2">{transaction.auction_id}</td>
        <td className="p-2">{transaction.title}</td>
        <td className="p-2">{transaction.status}</td>
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
            className={`py-1 px-3 rounded ${
              transaction.shipping_permit === 'Upcoming' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {transaction.shipping_permit}
          </span>
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
        <div className="bg-white shadow-md rounded-lg p-4">
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
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
    </div>
  );
};

export default Transactions;

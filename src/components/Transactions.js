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
          // Sort by auction start date
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
  
    // ✅ Function to automatically mark expired auctions as ended
    const markExpiredAuctionsAsEnded = async () => {
      try {
        console.log('🔹 Checking for expired auctions that are still "AVAILABLE"...');
  
        // Fetch all auctions that are still "AVAILABLE" but have expired
        const { data: expiredAuctions, error } = await supabase
          .from('livestock')
          .select('livestock_id')
          .eq('status', 'AVAILABLE')
          .lt('auction_end', new Date().toISOString()); // Auction should be expired
  
        if (error) {
          console.error('❌ Error fetching expired auctions:', error.message);
          return;
        }
  
        if (expiredAuctions.length > 0) {
          console.log(`⏳ Updating ${expiredAuctions.length} expired auctions to "AUCTION_ENDED"...`);
          const { error: updateError } = await supabase
            .from('livestock')
            .update({ status: 'AUCTION_ENDED' })
            .in('livestock_id', expiredAuctions.map(a => a.livestock_id));
  
          if (updateError) {
            console.error('❌ Error updating expired auctions:', updateError.message);
          } else {
            console.log('✅ Expired auctions successfully updated to "AUCTION_ENDED".');
          }
        } else {
          console.log('✅ No expired auctions found.');
        }
      } catch (err) {
        console.error('❌ Unexpected error updating expired auctions:', err.message);
      }
    };
  
    // ✅ Function to remove auctions that ended with no bids
    const removeEndedAuctions = async () => {
      try {
        console.log('🔹 Checking for ended auctions to remove...');
  
        // Fetch all auctions that have ended
        const { data: endedAuctions, error } = await supabase
          .from('livestock')
          .select('livestock_id')
          .eq('status', 'AUCTION_ENDED');
  
        if (error) {
          console.error('❌ Error fetching ended auctions:', error.message);
          return;
        }
  
        // Loop through each ended auction
        for (let auction of endedAuctions) {
          // Check if any bids exist for the auction
          const { data: highestBid, error: bidError } = await supabase
            .from('bids')
            .select('bidder_id')
            .eq('livestock_id', auction.livestock_id)
            .limit(1)
            .single();
  
          if (bidError && bidError.code !== 'PGRST116') {
            console.error(`❌ Error checking bids for ${auction.livestock_id}:`, bidError.message);
            continue;
          }
  
          // If no bids exist, delete the auction
          if (!highestBid) {
            console.log(`🗑 Deleting auction: ${auction.livestock_id}`);
            const { error: deleteError } = await supabase
              .from('livestock')
              .delete()
              .eq('livestock_id', auction.livestock_id);
  
            if (deleteError) {
              console.error('❌ Error deleting auction:', deleteError.message);
            }
          }
        }
      } catch (error) {
        console.error('❌ Error removing ended auctions:', error.message);
      }
    };
  
    // Fetch transactions and process expired auctions
    fetchTransactions();
    markExpiredAuctionsAsEnded();
    removeEndedAuctions();
  
    // Function to get current tab status filter
    const getStatusFilter = () => {
      if (activeTab === 'Pending') return ['PENDING'];
      if (activeTab === 'Ongoing') return ['AVAILABLE'];
      if (activeTab === 'Finished') return ['AUCTION_ENDED', 'SOLD'];
      if (activeTab === 'Disapproved') return ['DISAPPROVED'];
      return [];
    };
  
    // ✅ Real-time subscription to update transactions in real-time
    const subscription = supabase
      .channel('livestock-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'livestock' }, async (payload) => {
        const { eventType, new: newData, old: oldData } = payload;
  
        setTransactions((prevTransactions) => {
          const statusFilter = getStatusFilter();
  
          if (eventType === 'INSERT') {
            return statusFilter.includes(newData.status) ? [newData, ...prevTransactions] : prevTransactions;
          }
          if (eventType === 'UPDATE') {
            if (!statusFilter.includes(newData.status)) {
              return prevTransactions.filter((transaction) => transaction.livestock_id !== newData.livestock_id);
            }
            return prevTransactions.map((transaction) =>
              transaction.livestock_id === newData.livestock_id ? newData : transaction
            );
          }
          if (eventType === 'DELETE') {
            return prevTransactions.filter((transaction) => transaction.livestock_id !== oldData.livestock_id);
          }
          return prevTransactions;
        });
  
        // ✅ If auction is updated to "AUCTION_ENDED", attempt removal if necessary
        if (newData.status === 'AUCTION_ENDED') {
          await removeEndedAuctions();
        }
      })
      .subscribe();
  
    return () => {
      subscription.unsubscribe();
    };
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
      console.log(`🔹 Confirming action: ${selectedTransaction.action} for ${selectedTransaction.id}`);

      const updatedStatus = selectedTransaction.action === 'approve' ? 'AVAILABLE' : 'DISAPPROVED';

      // ✅ Update livestock status
      const { error } = await supabase
          .from('livestock')
          .update({ status: updatedStatus })
          .eq('livestock_id', selectedTransaction.id);

      if (error) throw error;
      console.log(`✅ Livestock ${selectedTransaction.id} updated to ${updatedStatus}`);

      setTransactions(transactions.map(transaction =>
          transaction.livestock_id === selectedTransaction.id
              ? { ...transaction, status: updatedStatus }
              : transaction
      ));

      // ✅ Fetch seller ID
      const { data: livestockData, error: sellerError } = await supabase
          .from('livestock')
          .select('owner_id, category')
          .eq('livestock_id', selectedTransaction.id)
          .single();

      if (sellerError || !livestockData?.owner_id) {
          console.error('❌ Error fetching seller:', sellerError?.message);
          return;
      }

      const sellerId = livestockData.owner_id;
      const category = livestockData.category;

      console.log(`✅ Seller ID: ${sellerId}, Category: ${category}`);

      // ✅ Send notifications
      if (updatedStatus === 'AVAILABLE') {
          console.log(`🔹 Triggering NEW_AUCTION notification for ${selectedTransaction.id}`);
          await handleNewAuctionNotification(selectedTransaction.id, category, sellerId); // Notify everyone except seller
          await sendNotificationToSeller(selectedTransaction.id, sellerId, 'AUCTION_APPROVED', 'Your auction has been approved and is now live!');
      } else {
          await sendNotificationToSeller(selectedTransaction.id, sellerId, 'AUCTION_DISAPPROVED', 'Your auction has been disapproved.');
      }

      setShowConfirmModal(false);
      setSelectedTransaction(null);
  } catch (error) {
      console.error('❌ Unexpected error during approval/disapproval:', error);
  }
};


const handleNewAuctionNotification = async (livestockId, category, sellerId) => {
  try {
      console.log(`🔹 Starting NEW_AUCTION notification for livestock: ${livestockId}`);

      // ✅ Fetch all users EXCEPT the seller from 'profiles'
      const { data: users, error: userError } = await supabase
          .from('profiles')  // ✅ Use 'profiles' table instead of 'users'
          .select('id')
          .neq('id', sellerId); // Exclude seller

      if (userError) throw userError;
      if (!users || users.length === 0) {
          console.warn("⚠ No users found for NEW_AUCTION notification.");
          return;
      }
      console.log('✅ Users to notify (excluding seller):', users.map(u => u.id));

      // ✅ Insert notification in `notifications` table
      const { data: insertedNotif, error: notifError } = await supabase
          .from('notifications')
          .insert([{
              livestock_id: livestockId,
              seller_id: null, // No seller since this is for all bidders
              message: `A new auction for ${category} is now live! Place your bids now.`,
              notification_type: 'NEW_AUCTION',
              is_read: false,
              created_at: new Date().toISOString(),
          }])
          .select()
          .single(); // Retrieve inserted notification

      if (notifError) throw notifError;
      if (!insertedNotif || !insertedNotif.id) {
          console.error("❌ Failed to insert NEW_AUCTION notification.");
          return;
      }

      console.log('✅ NEW_AUCTION notification created with ID:', insertedNotif.id);

      // ✅ Insert notifications for all users (except the seller) in `notification_bidders`
      const notifications = users.map(user => ({
          notification_id: insertedNotif.id, // Link to main notification
          bidder_id: user.id, // Notify only non-sellers
          notification_type: 'NEW_AUCTION',
          is_read: false,
          created_at: new Date().toISOString(),
      }));

      console.log('📌 Inserting notifications for:', notifications);

      const { error: insertError } = await supabase
          .from('notification_bidders')
          .insert(notifications);

      if (insertError) throw insertError;

      console.log('✅ NEW_AUCTION notifications successfully sent to all bidders (excluding seller).');

  } catch (err) {
      console.error('❌ Error sending NEW_AUCTION notification:', err.message);
  }
};




const sendNotificationToSeller = async (livestockId, sellerId, type, message) => {
  try {
      console.log(`🔹 Sending ${type} notification for livestock: ${livestockId}`);

      // ✅ Insert notification for seller
      const { error } = await supabase.from('notifications').insert([
          {
              livestock_id: livestockId,
              seller_id: sellerId, // ✅ Ensure seller_id is stored
              message: message,
              notification_type: type,
              is_read: false,
              created_at: new Date().toISOString(),
          },
      ]);

      if (error) {
          console.error(`❌ Error sending ${type} notification to seller:`, error.message);
      } else {
          console.log(`✅ ${type} notification sent to seller (${sellerId}).`);
      }
  } catch (err) {
      console.error(`❌ Unexpected error in ${type} notification:`, err.message);
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
        <td className="p-3 text-sm">{transaction.category}</td>
        <td className="p-3 text-sm">{transaction.breed}</td>
        <td className="p-3 text-sm">{transaction.age}</td>
        <td className="p-3 text-sm">{transaction.gender}</td>
        <td className="p-3 text-sm">{transaction.weight}kg</td>
        <td className="p-3 text-sm">P{transaction.starting_price}</td>
        <td className="p-3 text-sm">
          {format(new Date(transaction.auction_start), 'MM/dd/yyyy hh:mm a')}
        </td>
        <td className="p-3 text-sm">
          {format(new Date(transaction.auction_end), 'MM/dd/yyyy hh:mm a')}
        </td>
        <td className="p-3 text-sm">
        <span
  className={`py-1 px-3 rounded-full text-sm font-semibold inline-flex items-center ${
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
      <TopHeader title="Transactions" />
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
      <th className="p-1 text-xs text-white bg-green-800">Category</th>
      <th className="p-1 text-xs text-white bg-green-800">Breed</th>
      <th className="p-1 text-xs text-white bg-green-800">Age</th>
      <th className="p-1 text-xs text-white bg-green-800">Gender</th>
      <th className="p-1 text-xs text-white bg-green-800">Weight</th>
      <th className="p-1 text-xs text-white bg-green-800">Price</th>
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
